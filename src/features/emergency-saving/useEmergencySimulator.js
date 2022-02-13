import Decimal from 'decimal.js';
import React, { useEffect } from 'react';
import useSelectorForMonthlyBudgetStatus, {
  getMonthlyCalcs,
} from '../monthly-budget/useSelectorForMonthlyBudgetStatus';

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
    change('monthlySavingAmount')({ floatValue: totalIncomes.times(0.1).toNumber() });
  };

  useEffect(createInitialState, []);

  const {
    expenses = { floatValue: 0 },
    monthQuantity = { floatValue: 0 },
    previouslySavedAmount = { floatValue: 0 },
    monthlySavingAmount = { floatValue: 0 },
  } = formData || {};

  const objective = Decimal(expenses.floatValue || 0)
    .times(monthQuantity.floatValue || 0)
    .valueOf();

  const objectiveTime = Decimal(objective)
    .minus(previouslySavedAmount.floatValue || 0)
    .dividedBy(monthlySavingAmount.floatValue || 0)
    .ceil();

  const amountAfterObjetiveTime = Decimal(objectiveTime)
    .times(monthlySavingAmount.floatValue || 0)
    .plus(previouslySavedAmount.floatValue || 0);

  return {
    change,
    getValue,
    objectiveTime:
      !objectiveTime.isNaN() && objectiveTime.isFinite() && objectiveTime.isPositive()
        ? objectiveTime.valueOf()
        : 0,
    objective,
    amountAfterObjetiveTime:
      !amountAfterObjetiveTime.isNaN() &&
      amountAfterObjetiveTime.isPositive() &&
      amountAfterObjetiveTime.greaterThan(previouslySavedAmount.floatValue || 0)
        ? amountAfterObjetiveTime.valueOf()
        : previouslySavedAmount.floatValue || 0,
    formData,
  };
}
