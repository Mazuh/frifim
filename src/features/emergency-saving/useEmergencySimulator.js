import React, { useEffect } from 'react';
import useSelectorForMonthlyBudgetStatus, {
  getMonthlyCalcs,
} from '../monthly-budget/useSelectorForMonthlyBudgetStatus';
import { calculateObjective, calculateObjectiveTime } from './emergencyCalculations';

export default function useEmergencySimulator(fields) {
  const [formData, setFormData] = React.useState({});
  const change = (id) => (value) => setFormData((prevData) => ({ ...prevData, [id]: value }));

  const getValue = (id) => (formData[id] ? formData[id].floatValue || 0 : 0);

  const monthlySituation = useSelectorForMonthlyBudgetStatus();
  const { totalIncomes, totalExpenses } = getMonthlyCalcs(monthlySituation);

  const createInitialState = () => {
    setFormData(fields.reduce((allFields, field) => ({ ...allFields, [field.id]: 0 }), {}));

    change('monthQuantity')({ floatValue: 3 });
    change('expenses')({ floatValue: totalExpenses.toNumber() });
    change('recommendedEmergency')({ floatValue: totalIncomes.times(0.1).toNumber() });
  };

  useEffect(createInitialState, []);

  const defaultValue = { floatValue: 0 };
  const {
    expenses = defaultValue,
    monthQuantity = defaultValue,
    previouslySavedAmount = defaultValue,
    recommendedEmergency = defaultValue,
  } = formData || {};

  const objective = calculateObjective(expenses.floatValue, monthQuantity.floatValue);

  const objectiveTime = calculateObjectiveTime(
    objective,
    previouslySavedAmount.floatValue,
    recommendedEmergency.floatValue
  );

  return {
    change,
    getValue,
    objectiveTime,
    objective,
    formData,
  };
}
