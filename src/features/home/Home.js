import React from 'react';
import get from 'lodash.get';
import groupBy from 'lodash.groupby';
import Decimal from 'decimal.js';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { BsArrowLeftRight, BsBarChartFill, BsCalendar, BsPieChartFill } from 'react-icons/bs';
import { useHistory } from 'react-router';
import Dropdown from 'react-bootstrap/Dropdown';
import LoadingMainContainer from '../loading/LoadingMainContainer';
import useSelectorForMonthlyBudgetStatus, {
  getMonthlyCalcs,
} from '../monthly-budget/useSelectorForMonthlyBudgetStatus';
import getTransactionsCalcs from '../transactions/getTransactionsCalcs';
import { monthToString } from '../transactions/dates';
import { checkAnyBudget, copyBudgets } from './multi-month-stats';
import useBasicRequestData from '../../app/useBasicRequestData';
import useProjectPeriods, { periodToString } from '../periods/useProjectPeriods';
import { monthlyBudgetActions } from '../monthly-budget/monthlyBudgetDuck';
import { weeklyBudgetActions } from '../weekly-budget/weeklyBudgetDuck';
import BudgetsChart from './BudgetsChart';

export default function Home() {
  window.groupBy = groupBy;
  const dispatch = useDispatch();

  const history = useHistory();

  const basicReqData = useBasicRequestData();
  const { user, month } = basicReqData;

  const [isCopyingPeriod, setCopyingPeriod] = React.useState(false);

  const openPeriod = { month, year: 2021 };
  const lastPeriods = useProjectPeriods()
    .filter((it) => !(it.month === openPeriod.month && it.year === openPeriod.year))
    .reverse()
    .splice(0, 6);

  const projectUuid = get(basicReqData, 'project.uuid');
  const userUid = get(basicReqData, 'user.uid');
  const [hasAnyBudget, setHasAnyBudget] = React.useState(false);
  React.useEffect(() => {
    checkAnyBudget(userUid, projectUuid).then((result) => setHasAnyBudget(!!result));
  }, [userUid, projectUuid]);

  const isLoading = useSelector((state) =>
    Object.keys(state).some((slice) => slice !== 'projects' && state[slice].isLoading)
  );
  const monthlySituation = useSelectorForMonthlyBudgetStatus();
  const { onlyMonthlyIncomes, onlyWeeklyIncomes } = monthlySituation;
  console.log(
    'groupIncomesAmountsByCategories',
    groupIncomesAmountsByCategories(onlyMonthlyIncomes, onlyWeeklyIncomes)
  );
  const transactions = useSelector((state) => state.transactions.items);

  if (isLoading) {
    return <LoadingMainContainer />;
  }

  const monthlyBudgetCalcs = getMonthlyCalcs(monthlySituation);
  const transactionsCalcs = getTransactionsCalcs(transactions);
  const hasFinantialData = !monthlyBudgetCalcs.total.isZero() || !transactionsCalcs.total.isZero();

  const handleReuseBudgetSelect = (serializedPeriod) => {
    const selectedPeriod = JSON.parse(serializedPeriod);
    if (
      !window.confirm(
        `Copiar de ${periodToString(selectedPeriod)} para ${periodToString(openPeriod)}?`
      )
    ) {
      return;
    }

    setCopyingPeriod(true);
    copyBudgets(userUid, projectUuid, selectedPeriod, openPeriod)
      .then((result) => {
        window.alert(`Encontrado(s) ${result} orçamento(s). Pronto!`);
        setCopyingPeriod(false);
        dispatch(monthlyBudgetActions.readAll(basicReqData));
        dispatch(weeklyBudgetActions.readAll(basicReqData));
      })
      .catch((error) => {
        setCopyingPeriod(false);
        window.alert('Ops... Algo deu errado. Entre em contato com a manutenção, por gentileza.');
        console.error(
          'Error while copying budgets',
          error,
          'Params',
          userUid,
          projectUuid,
          selectedPeriod,
          openPeriod
        );
      });
  };

  return (
    <Container as="main">
      <header className="d-flex justify-content-between align-items-center">
        <h1 className="d-inline-block">
          Início{' '}
          <small className="d-none d-md-inline text-muted">Resumos de {monthToString(month)}</small>
        </h1>
        <p className="d-inline-block m-0">
          <span role="img" aria-label="Mão acenando">
            👋
          </span>
          <span className="ml-2">
            Olá, <span className="text-muted">{user.displayName || user.email || 'pessoa'}</span>
          </span>
        </p>
      </header>
      <Row>
        <Col as="section" md={8}>
          <Card>
            <Card.Header className="bg-dark text-light">
              <Card.Title as="h2">
                <BsBarChartFill /> Fluxos do mês
              </Card.Title>
            </Card.Header>
            {hasFinantialData ? (
              <Card.Body>
                <ul>
                  <li data-monthly-total="budgets">
                    <BsCalendar className="mr-1" />
                    <strong>Total dos orçamentos: </strong>
                    <span className={monthlyBudgetCalcs.total.lessThan(0) ? 'text-danger' : ''}>
                      R$ {monthlyBudgetCalcs.total.toFixed(2)}
                    </span>
                  </li>
                  <li data-monthly-total="transactions">
                    <BsArrowLeftRight className="mr-1" />
                    <strong>Total das transações: </strong>
                    <span className={transactionsCalcs.total.lessThan(0) ? 'text-danger' : ''}>
                      R$ {transactionsCalcs.total.toFixed(2)}
                    </span>
                  </li>
                </ul>
                <div className="mt-3">
                  <BudgetsChart />
                </div>
              </Card.Body>
            ) : hasAnyBudget && lastPeriods.length > 0 ? (
              <Card.Body>
                <p>
                  Há orçamentos em outros períodos, mas ainda <strong>não deste mês</strong>. Bora
                  se organizar?
                </p>
                {isCopyingPeriod ? (
                  <Button variant="warning" className="d-block w-100" disabled>
                    Copiando...
                  </Button>
                ) : (
                  <Dropdown onSelect={handleReuseBudgetSelect}>
                    <Dropdown.Toggle variant="warning" id="reuse-budget-select" className="w-100">
                      Copiar de outro mês
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {lastPeriods.map((period) => (
                        <Dropdown.Item
                          key={period.month.toString() + period.year.toString()}
                          eventKey={JSON.stringify(period)}
                        >
                          {periodToString(period)}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                <p className="text-center text-muted m-0">ou...</p>
                <Button
                  variant="outline-primary"
                  onClick={() => history.push('/orçamento-mensal')}
                  className="w-100"
                  disabled={isCopyingPeriod}
                >
                  Começar do zero
                </Button>
              </Card.Body>
            ) : (
              <Card.Body>
                <p>
                  Quando você começar a cadastrar orçamentos mensais, por exemplo, um gráfico
                  aparecerá aqui. Serão <strong>informações inteligentes</strong> te que guiarão
                  sobre a situação do mês.
                </p>
                <Button onClick={() => history.push('/orçamento-mensal')} className="w-100">
                  Começar
                </Button>
              </Card.Body>
            )}
          </Card>
        </Col>
        <Col as="section" md={4}>
          <Card>
            <Card.Header className="bg-dark text-light">
              <Card.Title as="h2">
                <BsPieChartFill /> Em breve...
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Aguarde novas atualizações!</strong> Haverá mais gráficos, como estatisticas
                de categorias mais usadas (tanto linha de orçamento quanto de transações), dias do
                mês com picos de transações (gráfico de linha) e quanto de valor ainda pode ser
                transacionado antes alcançar o orçado.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function groupIncomesAmountsByCategories(monthlyBudgetIncomes, weeklyBudgetIncomes) {
  const allBudgetItems = monthlyBudgetIncomes.concat(weeklyBudgetIncomes);

  const incomesGroupebByCategories = groupBy(allBudgetItems, 'category');

  return Object.keys(incomesGroupebByCategories).reduce((groupedAmounts, categoryId) => {
    const categoryAmount = incomesGroupebByCategories[categoryId].reduce(
      (amount, income) => Decimal(amount).plus(income.amount).toFixed(2),
      0
    );
    groupedAmounts[categoryId] = categoryAmount;
    return groupedAmounts;
  }, {});
}
