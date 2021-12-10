import React, { useEffect } from 'react';
import useSelectorForMonthlyBudgetStatus from '../monthly-budget/useSelectorForMonthlyBudgetStatus';
import {
  calculateBudgets,
  calculateObjective,
  calculateObjectiveTime,
} from './emergencyCalculations';

const useEmergencySimulator = (fields) => {
  const [formData, setFormData] = React.useState({});
  const change = (id) => (value) => setFormData((prevData) => ({ ...prevData, [id]: value }));

  const getValue = (id) => (formData[id] ? formData[id].floatValue || 0 : 0);

  const monthlySituation = useSelectorForMonthlyBudgetStatus();
  const { onlyMonthlyIncomes, onlyMonthlyExpenses } = monthlySituation;

  useEffect(() => {
    setFormData(fields.reduce((allFields, field) => ({ ...allFields, [field.id]: 0 }), {}));

    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const totalMonthlyIncome = calculateBudgets(year, month)(onlyMonthlyIncomes);
    const totalMonthlyExpenses = calculateBudgets(year, month)(onlyMonthlyExpenses);

    change('monthQuantity')({ floatValue: 3 });
    change('expenses')({ floatValue: totalMonthlyExpenses });
    change('recommendedEmergency')({ floatValue: totalMonthlyIncome * 0.1 });
    // eslint-disable-next-line
  }, []);

  const defaultValue = { floatValue: 0 };
  const {
    expenses = defaultValue,
    monthQuantity = defaultValue,
    previusSavedMoney = defaultValue,
    recommendedEmergency = defaultValue,
  } = formData || {};

  const objective = calculateObjective(expenses.floatValue, monthQuantity.floatValue);

  const objectiveTime = calculateObjectiveTime(
    objective,
    previusSavedMoney.floatValue,
    recommendedEmergency.floatValue
  );

  return {
    change,
    getValue,
    objectiveTime,
    objective,
    formData,
  };
};

export default useEmergencySimulator;
