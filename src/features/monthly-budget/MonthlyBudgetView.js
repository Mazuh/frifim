import React from "react";
import Container from "react-bootstrap/Container";
import { useSelector, useDispatch } from "react-redux";
import { BsPlusSquare } from "react-icons/bs";
import LoadingContainer from "../loading/LoadingContainer";
import { EXPENSE_TYPE, INCOME_TYPE } from "../categories/constants";
import { monthlyBudgetActions } from "./monthlyBudgetDuck";
import useIzitoastForResource from "../izitoast-for-resources/useIzitoastForResource";
import BudgetTable from "./BudgetTable";
import BudgetForm from "./BudgetForm";
import useSelectorForMonthlySituation from './useSelectorForMonthlySituation';

export default function MonthlyBudgetView() {
  const dispatch = useDispatch();

  const monthlySituation = useSelectorForMonthlySituation();

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

  useIzitoastForResource('monthlyBudget');

  if (monthlySituation.isReadingAll) {
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
        <h2><BsPlusSquare /> Criar</h2>
        <MonthlyBudgetForm
          onSubmit={handleSubmit}
          isLoading={monthlySituation.isLoading}
          isCreating={monthlySituation.isCreating}
        />
      </section>
      <section>
        <h2><INCOME_TYPE.Icon /> {INCOME_TYPE.pluralLabel}</h2>
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
        <h2><EXPENSE_TYPE.Icon /> {EXPENSE_TYPE.pluralLabel}</h2>
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
