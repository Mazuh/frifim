import React from "react";
import get from "lodash.get";
import { useDispatch, useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { BsArrowLeftRight, BsCalendarFill, BsPieChartFill } from "react-icons/bs";
import { useHistory } from "react-router";
import Dropdown from "react-bootstrap/Dropdown";
import LoadingMainContainer from "../loading/LoadingMainContainer";
import { INCOME_TYPE, EXPENSE_TYPE } from "../categories/constants";
import useSelectorForMonthlyBudgetStatus, { getMonthlyCalcs } from "../monthly-budget/useSelectorForMonthlyBudgetStatus";
import getTransactionsCalcs from "../transactions/getTransactionsCalcs";
import { monthToString } from "../transactions/dates";
import { checkAnyBudget, copyBudgets } from "./multi-month-stats";
import useBasicRequestData from "../../app/useBasicRequestData";
import useProjectPeriods, { periodToString } from "../periods/useProjectPeriods";
import { monthlyBudgetActions } from "../monthly-budget/monthlyBudgetDuck";
import { weeklyBudgetActions } from "../weekly-budget/weeklyBudgetDuck";

export default function Home() {
  const dispatch = useDispatch();

  const history = useHistory();

  const basicReqData = useBasicRequestData();
  const { user, month } = basicReqData;

  const [isCopyingPeriod, setCopyingPeriod] = React.useState(false);

  const openPeriod = { month, year: 2021 };
  const lastPeriods = useProjectPeriods()
    .filter(it => !(it.month === openPeriod.month && it.year === openPeriod.year))
    .reverse()
    .splice(0, 6);

  const projectUuid = get(basicReqData, 'project.uuid');
  const userUid = get(basicReqData, 'user.uid');
  const [hasAnyBudget, setHasAnyBudget] = React.useState(false);
  React.useEffect(() => {
    checkAnyBudget(userUid, projectUuid).then(result => setHasAnyBudget(!!result));
  }, [userUid, projectUuid]);

  const isLoading = useSelector(state => Object.keys(state).some(
    slice => slice !== 'projects' && state[slice].isLoading
  ));
  const monthlySituation = useSelectorForMonthlyBudgetStatus();
  const transactions = useSelector(state => state.transactions.items);

  if (isLoading) {
    return <LoadingMainContainer />
  }

  const transactionsCalcs = getTransactionsCalcs(transactions);

  const isCurrentlyHealthy = transactionsCalcs.total.isZero() || transactionsCalcs.total.isPositive();

  const transactionsChartData = {
    labels: [INCOME_TYPE.pluralLabel, EXPENSE_TYPE.pluralLabel],
    datasets: [
      {
        backgroundColor: ['rgba(0, 123, 255, 0.5)', 'rgba(255, 193, 7, 0.5)'],
        hoverBackgroundColor: ['rgba(0, 123, 255, 0.7)', 'rgba(255, 193, 7, 0.7)'],
        data: [transactionsCalcs.totalIncomes, transactionsCalcs.totalExpenses],
      },
    ],
  };

  const monthlyBudgetCalcs = getMonthlyCalcs(monthlySituation);

  const isBudgetHealthy = monthlyBudgetCalcs.total.isZero() || monthlyBudgetCalcs.total.isPositive();

  const budgetChartData = {
    labels: [INCOME_TYPE.pluralLabel, EXPENSE_TYPE.pluralLabel],
    datasets: [
      {
        backgroundColor: ['rgba(0, 123, 255, 0.5)', 'rgba(255, 193, 7, 0.5)'],
        hoverBackgroundColor: ['rgba(0, 123, 255, 0.7)', 'rgba(255, 193, 7, 0.7)'],
        data: [monthlyBudgetCalcs.totalIncomes, monthlyBudgetCalcs.totalExpenses],
      },
    ],
  };

  const handleReuseBudgetSelect = (serializedPeriod) => {
    const selectedPeriod = JSON.parse(serializedPeriod);
    if (!window.confirm(`Copiar de ${periodToString(selectedPeriod)} para ${periodToString(openPeriod)}?`)) {
      return;
    }

    setCopyingPeriod(true);
    copyBudgets(userUid, projectUuid, selectedPeriod, openPeriod).then((result) => {
      window.alert(`Encontrado(s) ${result} orçamento(s). Pronto!`);
      setCopyingPeriod(false);
      dispatch(monthlyBudgetActions.readAll(basicReqData));
      dispatch(weeklyBudgetActions.readAll(basicReqData));
    }).catch((error) => {
      setCopyingPeriod(false);
      window.alert('Ops... Algo deu errado. Entre em contato com a manutenção, por gentileza.');
      console.error('Error while copying budgets', error, 'Params', userUid, projectUuid, selectedPeriod, openPeriod);
    });
  }

  return (
    <Container as="main">
      <header className="d-flex justify-content-between align-items-center">
        <h1 className="d-inline-block">
          Início
          {' '}
          <small className="d-none d-md-inline text-muted">
            Resumos de {monthToString(month)}
          </small>
        </h1>
        <p className="d-inline-block m-0">
          <span role="img" aria-label="Money">💸</span>
          <span className="ml-2">
            Olá,
            {' '}
            <span className="text-muted">{user.displayName || user.email || 'pessoa'}</span>
          </span>
        </p>
      </header>
      <Row>
        <Col as="section" md={4}>
          <Card>
            <Card.Header className="bg-dark text-light">
              <Card.Title as="h2">
                <BsCalendarFill /> Orçamentos
              </Card.Title>
            </Card.Header>
              {!monthlyBudgetCalcs.totalIncomes.isZero() || !monthlyBudgetCalcs.totalExpenses.isZero() ? (
                <Card.Body>
                  <ul>
                    <li className="text-secondary">
                      <strong>{INCOME_TYPE.label}: </strong>
                      <span>R$ {monthlyBudgetCalcs.totalIncomes.toFixed(2)} </span>
                      <INCOME_TYPE.Icon className="text-primary" />
                    </li>
                    <li className="text-secondary">
                      <strong>{EXPENSE_TYPE.label}: </strong>
                      <span>R$ {monthlyBudgetCalcs.totalExpenses.toFixed(2)} </span>
                      <EXPENSE_TYPE.Icon className="text-warning" />
                    </li>
                    <li>
                      <strong>Total: </strong>
                      <span className={isBudgetHealthy ? 'text-success' : 'text-danger'}>
                        R$ {monthlyBudgetCalcs.total.toFixed(2)}
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3">
                    <Pie options={{ maintainAspectRatio: false }} height={300} data={budgetChartData} />
                  </div>
                </Card.Body>
              ) : (
                hasAnyBudget && lastPeriods.length > 0 ? (
                  <Card.Body>
                    <p>
                      Há orçamentos em outros períodos,
                      mas ainda <strong>não deste mês</strong>.
                      Bora se organizar?
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
                          {lastPeriods.map(period => (
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
                      Quando você começar a cadastrar orçamentos mensais,
                      um gráfico aparecerá aqui.
                    </p>
                    <Button onClick={() => history.push('/orçamento-mensal')} className="w-100">
                      Começar
                    </Button>
                  </Card.Body>
                )
              )}
          </Card>
        </Col>
        <Col as="section" md={4}>
          <Card>
            <Card.Header className="bg-dark text-light">
              <Card.Title as="h2">
                <BsArrowLeftRight /> Transações
              </Card.Title>
            </Card.Header>
            {transactionsCalcs.totalIncomes.isZero() && transactionsCalcs.totalExpenses.isZero() ? (
              <Card.Body>
                <p>
                  Aparecerá um resumo visual das transações do mês aqui, quando você começar a registrá-las.
                </p>
              </Card.Body>
            ) : (
              <Card.Body>
                <ul>
                  <li className="text-secondary">
                    <strong>{INCOME_TYPE.label}: </strong>
                    <span>R$ {transactionsCalcs.totalIncomes.toFixed(2)} </span>
                    <INCOME_TYPE.Icon className="text-primary" />
                  </li>
                  <li className="text-secondary">
                    <strong>{EXPENSE_TYPE.label}: </strong>
                    <span>R$ {transactionsCalcs.totalExpenses.toFixed(2)} </span>
                    <EXPENSE_TYPE.Icon className="text-warning" />
                  </li>
                  <li>
                    <strong>Total: </strong>
                    <span className={isCurrentlyHealthy ? 'text-success' : 'text-danger'}>
                      R$ {transactionsCalcs.total.toFixed(2)}
                    </span>
                  </li>
                </ul>
                <div className="mt-3">
                  <Pie options={{ maintainAspectRatio: false }} height={300} data={transactionsChartData} />
                </div>
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
                <strong>Aguarde novas atualizações!</strong> Haverá mais gráficos,
                como estatisticas de categorias mais
                usadas (tanto linha de orçamento quanto de transações),
                dias do mês com picos de transações (gráfico de linha)
                e quanto de valor ainda pode ser transacionado antes
                alcançar o orçado.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
