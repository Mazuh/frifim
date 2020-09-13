import React from "react";
import { useSelector } from "react-redux";
import Decimal from "decimal.js";
import LoadingContainer from "../loading/LoadingContainer";
import { INCOME_TYPE, EXPENSE_TYPE } from "../categories/constants";

export default function Home() {
  const isLoading = useSelector(state => Object.keys(state).some(slice => state[slice].isLoading));
  const monthlyBudgetItems = useSelector(state => state.monthlyBudget.items);

  if (isLoading) {
    return <LoadingContainer />
  }

  const monthlyCalcs = monthlyBudgetItems.reduce((acc, budget) => {
    const isIncome = budget.type === INCOME_TYPE.value;
    const totalOperationKey = isIncome ? 'plus' : 'minus';
    const typeKey = isIncome ? 'incomes' : 'expenses';

    return {
      ...acc,
      total: acc.total[totalOperationKey](budget.amount),
      [typeKey]: acc[typeKey].plus(budget.amount),
    };
  }, { total: Decimal(0), incomes: Decimal(0), expenses: Decimal(0) });

  const isHealthy = monthlyCalcs.total.isZero() || monthlyCalcs.total.isPositive();

  return (
    <main className="container">
      <header>
        <h1>Página inicial</h1>
      </header>
      <section>
        <h2>Resumo do orçamento</h2>
        <ul>
          <li className="text-secondary"><strong>{INCOME_TYPE.label}: </strong>
            R$ {monthlyCalcs.incomes.toFixed(2)}
          </li>
          <li className="text-secondary"><strong>{EXPENSE_TYPE.label}: </strong>
            R$ {monthlyCalcs.expenses.toFixed(2)}
          </li>
          <li>
            <strong>Total: </strong>
            <span className={isHealthy ? 'text-success' : 'text-danger'}>
              R$ {monthlyCalcs.total.toFixed(2)}
            </span>
          </li>
        </ul>
      </section>
    </main>
  );
}
