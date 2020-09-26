import React from "react";
import { useSelector } from "react-redux";
import LoadingContainer from "../loading/LoadingContainer";
import { INCOME_TYPE, EXPENSE_TYPE } from "../categories/constants";
import useSelectorForMonthlySituation, { getMonthlyCalcs } from "../monthly-budget/useSelectorForMonthlySituation";

export default function Home() {
  const isLoading = useSelector(state => Object.keys(state).some(slice => state[slice].isLoading));
  const monthlySituation = useSelectorForMonthlySituation();

  if (isLoading) {
    return <LoadingContainer />
  }

  const monthlyCalcs = getMonthlyCalcs(monthlySituation);

  const isHealthy = monthlyCalcs.total.isZero() || monthlyCalcs.total.isPositive();

  return (
    <main className="container">
      <header>
        <h1>Página inicial</h1>
      </header>
      <section>
        <h2>Resumo do mês</h2>
        <ul>
          <li className="text-secondary"><strong>{INCOME_TYPE.label}: </strong>
            R$ {monthlyCalcs.subtotalIncomes.toFixed(2)}
          </li>
          <li className="text-secondary"><strong>{EXPENSE_TYPE.label}: </strong>
            R$ {monthlyCalcs.subtotalExpenses.toFixed(2)}
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
