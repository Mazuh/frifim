import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useSelector, useDispatch } from "react-redux";
import { BsPlusSquare } from "react-icons/bs";
import LoadingContainer from "../loading/LoadingContainer";
import { EXPENSE_TYPE, INCOME_TYPE } from "../categories/constants";
import { monthlyBudgetActions } from "./monthlyBudgetDuck";
import BudgetTable from "./BudgetTable";
import BudgetForm from "./BudgetForm";
import useSelectorForMonthlyBudgetStatus from './useSelectorForMonthlyBudgetStatus';

export default function MonthlyBudgetView() {
  const dispatch = useDispatch();

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
    return <LoadingContainer />
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const creatingBudget = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
      category: event.target.category.value,
    };
    dispatch(monthlyBudgetActions.create(creatingBudget));

    event.target.reset();
  };

  const handleUpdate = (budget) => {
    setEnabledUpdateUuid(enabledUpdateUuid === budget.uuid ? null : budget.uuid);
  };

  const handleDelete = (budget) => {
    if (window.confirm(`Deletar do orçamento "${budget.name}"?`)) {
      dispatch(monthlyBudgetActions.delete(budget.uuid));
    }
  }

  return (
    <Container as="main">
      <header>
        <h1>Orçamento mensal</h1>
      </header>
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
    </Container>
  );
}

const MonthlyBudgetForm = BudgetForm;

function MonthlyBudgetTableRowExtension({ budget }) {
  const dispatch = useDispatch();
  const isUpdating = useSelector(state => state.monthlyBudget.updating.includes(budget.uuid));
  const isLoading = useSelector(state => state.monthlyBudget.isLoading);

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatingBudget = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
      category: event.target.category.value,
    };
    dispatch(monthlyBudgetActions.update(budget.uuid, updatingBudget));
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
