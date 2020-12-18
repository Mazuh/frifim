import React from "react";
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { BsBarChart } from "react-icons/bs";
import LoadingContainer from "../loading/LoadingContainer";
import { INCOME_TYPE, EXPENSE_TYPE } from "../categories/constants";
import useSelectorForMonthlyBudgetStatus, { getMonthlyCalcs } from "../monthly-budget/useSelectorForMonthlyBudgetStatus";

export default function Home() {
  const isLoading = useSelector(state => Object.keys(state).some(slice => state[slice].isLoading));
  const monthlySituation = useSelectorForMonthlyBudgetStatus();

  if (isLoading) {
    return <LoadingContainer />
  }

  const monthlyCalcs = getMonthlyCalcs(monthlySituation);

  const isHealthy = monthlyCalcs.total.isZero() || monthlyCalcs.total.isPositive();

  const chartData = {
    labels: [INCOME_TYPE.pluralLabel, EXPENSE_TYPE.pluralLabel],
    datasets: [
      {
        backgroundColor: ['rgba(0, 123, 255, 0.5)', 'rgba(255, 193, 7, 0.5)'],
        hoverBackgroundColor: ['rgba(0, 123, 255, 0.7)', 'rgba(255, 193, 7, 0.7)'],
        data: [monthlyCalcs.subtotalIncomes, monthlyCalcs.subtotalExpenses],
      },
    ],
  };

  return (
    <main className="container">
      <header>
        <h1>Página inicial</h1>
      </header>
      <section>
        <h2><BsBarChart /> Resumo do orçamento do mês</h2>
        <ul>
          <li className="text-secondary">
            <strong>{INCOME_TYPE.label}: </strong>
            <span>R$ {monthlyCalcs.subtotalIncomes.toFixed(2)} </span>
            <INCOME_TYPE.Icon className="text-primary" />
          </li>
          <li className="text-secondary">
            <strong>{EXPENSE_TYPE.label}: </strong>
            <span>R$ {monthlyCalcs.subtotalExpenses.toFixed(2)} </span>
            <EXPENSE_TYPE.Icon className="text-warning" />
          </li>
          <li>
            <strong>Total: </strong>
            <span className={isHealthy ? 'text-success' : 'text-danger'}>
              R$ {monthlyCalcs.total.toFixed(2)}
            </span>
          </li>
        </ul>
        <div className="mt-3">
          <Pie options={{ maintainAspectRatio: false }} height={300} data={chartData} />
        </div>
      </section>
    </main>
  );
}
