import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import { BsPlusSquare } from "react-icons/bs";
import LoadingMainContainer from "../loading/LoadingMainContainer";
import { EXPENSE_TYPE, INCOME_TYPE } from "../categories/constants";
import { monthlyBudgetActions } from "./monthlyBudgetDuck";
import BudgetTable from "./BudgetTable";
import BudgetForm from "./BudgetForm";
import useSelectorForMonthlyBudgetStatus from './useSelectorForMonthlyBudgetStatus';
import useBasicRequestData from "../../app/useBasicRequestData";

export default function MonthlyBudgetView() {
  const dispatch = useDispatch();
  const basicRequestData = useBasicRequestData();

  const [isHelpVisible, setHelpVisible] = React.useState(false);

  const monthlySituation = useSelectorForMonthlyBudgetStatus();

  const monthlyIncomes = monthlySituation.onlyMonthlyIncomes;
  if (!monthlySituation.totalWeeklyIncomes.isZero()) {
    monthlyIncomes.push({
      uuid: 'weekly-incomes-sum',
      name: `${INCOME_TYPE.pluralLabel} semanais`,
      tooltip: 'Somatório de 4 semanas do planejamento semanal.',
      amount: monthlySituation.totalWeeklyIncomes.toFixed(2),
      isReadOnly: true,
    });
  }

  const monthlyExpenses = monthlySituation.onlyMonthlyExpenses;
  if (!monthlySituation.totalWeeklyExpenses.isZero()) {
    monthlyExpenses.push({
      uuid: 'weekly-expenses-sum',
      name: `${EXPENSE_TYPE.pluralLabel} semanais`,
      tooltip: 'Somatório de 4 semanas do planejamento semanal.',
      amount: monthlySituation.totalWeeklyExpenses.toFixed(2),
      isReadOnly: true,
    });
  }

  const [enabledUpdateUuid, setEnabledUpdateUuid] = React.useState(null);

  if (monthlySituation.isReadingAll) {
    return <LoadingMainContainer />
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const creatingBudget = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
      category: event.target.category.value,
      year: basicRequestData.year,
      month: basicRequestData.month,
    };
    dispatch(monthlyBudgetActions.create(creatingBudget, basicRequestData));

    event.target.reset();
  };

  const handleUpdate = (budget) => {
    setEnabledUpdateUuid(enabledUpdateUuid === budget.uuid ? null : budget.uuid);
  };

  const handleDelete = (budget) => {
    if (window.confirm(`Deletar do orçamento "${budget.name}"?`)) {
      dispatch(monthlyBudgetActions.delete(budget.uuid, basicRequestData));
    }
  }

  return (
    <Container as="main">
      <Row as="header" className="align-items-center mb-2">
        <Col xs="12" sm="10"><h1>Orçamento mensal</h1></Col>
        <Col xs="12" sm="auto">
          <Button onClick={() => setHelpVisible(true)} size="sm" variant="outline-secondary">
            O que é isso?
          </Button>
          <Modal show={isHelpVisible} onHide={() => setHelpVisible(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Orçamento mensal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Estimativa de dinheiro
                que <strong>entra (receita)</strong> e <strong>sai (despesa)</strong> no
                no mês. Exemplos:
              </p>
              <ul>
                <li>Receitas: salário líquido, mesada, bolsa, comissões.</li>
                <li>Despesas essenciais: água, luz, alimentação, remédios.</li>
                <li>Outras despesas: assinaturas, cinema, lanches.</li>
              </ul>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
      <Card as="section" className="mb-3">
        <Card.Header className="bg-dark text-light">
          <Card.Title as="h2">
            <BsPlusSquare /> Criar
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <MonthlyBudgetForm
            onSubmit={handleSubmit}
            isLoading={monthlySituation.isLoading}
            isCreating={monthlySituation.isCreating}
          />
        </Card.Body>
      </Card>
      {!monthlyIncomes.length && !monthlyExpenses.length ? (
        <p>O planejamento mensal deste mês não foi encontrado ou não foi criado ainda.</p>
      ) : (
        <>
          <section>
            <header className="card-header bg-dark text-light">
              <h2>
                <INCOME_TYPE.Icon /> {INCOME_TYPE.pluralLabel}
              </h2>
            </header>
            <BudgetTable
              items={monthlyIncomes}
              onDelete={handleDelete}
              deleting={monthlySituation.deleting}
              onUpdate={handleUpdate}
              updating={monthlySituation.updating}
              extendedUuid={enabledUpdateUuid}
              ExtendedComponent={MonthlyBudgetTableRowExtension}
            />
          </section>
          <section>
            <header className="card-header bg-dark text-light">
              <h2>
                <EXPENSE_TYPE.Icon /> {EXPENSE_TYPE.pluralLabel}
              </h2>
            </header>
            <BudgetTable
              items={monthlyExpenses}
              onDelete={handleDelete}
              deleting={monthlySituation.deleting}
              onUpdate={handleUpdate}
              updating={monthlySituation.updating}
              extendedUuid={enabledUpdateUuid}
              ExtendedComponent={MonthlyBudgetTableRowExtension}
            />
          </section>
        </>
      )}
    </Container>
  );
}

const MonthlyBudgetForm = BudgetForm;

function MonthlyBudgetTableRowExtension({ budget }) {
  const dispatch = useDispatch();
  const basicRequestData = useBasicRequestData();
  const isUpdating = useSelector(state => state.monthlyBudget.updating.includes(budget.uuid));
  const isLoading = useSelector(state => state.monthlyBudget.isLoading);

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatingBudget = {
      uuid: budget.uuid,
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
      category: event.target.category.value,
    };
    dispatch(monthlyBudgetActions.update(budget.uuid, updatingBudget, basicRequestData));
  };

  return (
    <MonthlyBudgetForm
      budget={budget}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isUpdating={isUpdating}
    />
  );
}
