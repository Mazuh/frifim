import React from "react";
import Container from "react-bootstrap/Container";
import { useSelector, useDispatch } from "react-redux";
import LoadingContainer from "../loading/LoadingContainer";
import { EXPENSE_TYPE, INCOME_TYPE } from "../categories/constants";
import { monthlyBudgetActions } from "./monthlyBudgetDuck";
import useIzitoastForResource from "../izitoast-for-resources/useIzitoastForResource";
import BudgetTable from "./BudgetTable";
import BudgetForm from "./BudgetForm";

export default function MonthlyBudgetView() {
  const dispatch = useDispatch();
  const monthlyBudgetState = useSelector(state => state.monthlyBudget);
  const [enabledUpdateUuid, setEnabledUpdateUuid] = React.useState(null);

  useIzitoastForResource('monthlyBudget');

  if (monthlyBudgetState.isReadingAll) {
    return <LoadingContainer />
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const creatingBudget = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
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
      <section>
        <h2>Criar</h2>
        <MonthlyBudgetForm
          onSubmit={handleSubmit}
          isLoading={monthlyBudgetState.isLoading}
          isCreating={monthlyBudgetState.isCreating}
        />
      </section>
      <section>
        <h2>{INCOME_TYPE.pluralLabel}</h2>
        <BudgetTable
          items={monthlyBudgetState.items.filter(c => c.type === INCOME_TYPE.value)}
          onDelete={handleDelete}
          deleting={monthlyBudgetState.deleting}
          onUpdate={handleUpdate}
          updating={monthlyBudgetState.updating}
          extendedUuid={enabledUpdateUuid}
          ExtendedComponent={MonthlyBudgetTableRowExtension}
        />
      </section>
      <section>
        <h2>{EXPENSE_TYPE.pluralLabel}</h2>
        <BudgetTable
          items={monthlyBudgetState.items.filter(c => c.type === EXPENSE_TYPE.value)}
          onDelete={handleDelete}
          deleting={monthlyBudgetState.deleting}
          onUpdate={handleUpdate}
          updating={monthlyBudgetState.updating}
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

    const creatingBudget = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
    };
    dispatch(monthlyBudgetActions.update(budget.uuid, creatingBudget));
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
