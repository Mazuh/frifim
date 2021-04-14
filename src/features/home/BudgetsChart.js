import React from 'react';
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";
import { v4 as uuidv4 } from "uuid";
import { EXPENSE_TYPE, INCOME_TYPE } from '../categories/constants';
import useSelectorForMonthlyBudgetStatus, { getMonthlyCalcs } from '../monthly-budget/useSelectorForMonthlyBudgetStatus';
import { useSelector } from 'react-redux';
import getTransactionsCalcs from '../transactions/getTransactionsCalcs';

export default function BudgetsChart() {
  const chartRef = React.useRef(null);
  const idRef = React.useRef(`budgets-chart-${uuidv4()}`);
  const id = idRef.current;
  const idSelector = `#${id}`;

  const monthlySituation = useSelectorForMonthlyBudgetStatus();
  const monthlyBudgetCalcs = getMonthlyCalcs(monthlySituation);

  const transactions = useSelector(state => state.transactions.items);
  const transactionsCalcs = getTransactionsCalcs(transactions);

  React.useEffect(() => {
    if (chartRef.current) {
      return;
    }

    chartRef.current = new Chart(idSelector, {
      title: "",
      type: 'bar',
      height: 300,
      colors: ['rgba(0, 123, 255, 0.5)', 'rgba(255, 193, 7, 0.5)'],
      data: {
        labels: ['Orçamentos', 'Transações'],
        datasets: [
          {
            name: INCOME_TYPE.pluralLabel,
            values: [monthlyBudgetCalcs.totalIncomes, transactionsCalcs.totalIncomes],
          },
          {
            name: EXPENSE_TYPE.pluralLabel,
            values: [monthlyBudgetCalcs.totalExpenses, transactionsCalcs.totalExpenses],
          },
        ],
      },
    });
  }, [
    idSelector,
    monthlyBudgetCalcs.totalExpenses,
    monthlyBudgetCalcs.totalIncomes,
    transactionsCalcs.totalExpenses,
    transactionsCalcs.totalIncomes,
  ]);

  return (
    <div id={id} />
  );
}
