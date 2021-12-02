import React, { useEffect } from 'react';
import useSelectorForMonthlyBudgetStatus from '../monthly-budget/useSelectorForMonthlyBudgetStatus';

const calculateTotal = (year, month) => (budgets) =>
  budgets
    .filter((income) => income.year === year && income.month === month)
    .reduce((allIncome, income) => parseFloat(allIncome + income.amount), 0);

const useEmergencySimulator = (fields) => {
  const [formData, setFormData] = React.useState({});
  const change = (id) => (value) => setFormData((prevData) => ({ ...prevData, [id]: value }));

  const monthlySituation = useSelectorForMonthlyBudgetStatus();
  const { onlyMonthlyIncomes, onlyMonthlyExpenses } = monthlySituation;

  useEffect(() => {
    setFormData(fields.reduce((allFields, field) => ({ ...allFields, [field.id]: 0 }), {}));

    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const totalMonthlyIncome = calculateTotal(year, month)(onlyMonthlyIncomes);
    const totalMonthlyExpenses = calculateTotal(year, month)(onlyMonthlyExpenses);

    change('monthQuantity')({ floatValue: 3 });
    change('expenses')({ floatValue: totalMonthlyExpenses });
    change('recommendedEmergency')({ floatValue: totalMonthlyIncome * 0.1 });
  }, []);

  const defaultValue = { floatValue: 0 };
  const {
    expenses = defaultValue,
    monthQuantity = defaultValue,
    previusSavedMoney = defaultValue,
    recommendedEmergency = defaultValue,
  } = formData || {};

  const objective = expenses.floatValue * monthQuantity.floatValue;

  const objectiveTime =
    Math.ceil((objective - previusSavedMoney.floatValue) / recommendedEmergency.floatValue) || 0;

  return {
    change,
    objectiveTime,
    objective,
    formData,
  };
};

export default useEmergencySimulator;
