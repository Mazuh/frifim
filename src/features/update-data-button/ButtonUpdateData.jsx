import React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { LastUpdateContext } from '../../app/contexts';
import useBasicRequestData from '../../app/useBasicRequestData';
import { categoriesActions } from '../categories/categoriesDuck';
import { monthlyBudgetActions } from '../monthly-budget/monthlyBudgetDuck';
import { transactionsActions } from '../transactions/transactionsDuck';
import { weeklyBudgetActions } from '../weekly-budget/weeklyBudgetDuck';

export default function ButtonUpdateData({ className }) {
  const dispatch = useDispatch();
  const { setLastUpdate } = React.useContext(LastUpdateContext);
  const [disabled, setDisabled] = React.useState(false);
  const basicRequestData = useBasicRequestData();

  const handleUpdateData = () => {
    dispatch(categoriesActions.readAll(basicRequestData));
    dispatch(monthlyBudgetActions.readAll(basicRequestData));
    dispatch(weeklyBudgetActions.readAll(basicRequestData));
    dispatch(transactionsActions.readAll(basicRequestData));
    setDisabled(true);
    setLastUpdate(new Date().toLocaleString());
  };

  React.useEffect(() => {
    if (!disabled) return;

    const disabledTimeout = setTimeout(() => {
      setDisabled(false);
    }, 10000);

    return () => clearTimeout(disabledTimeout);
  }, [disabled]);

  return (
    <Button
      className={className}
      variant="secondary"
      disabled={disabled}
      onClick={handleUpdateData}
    >
      <span>Atualizar dados</span>
    </Button>
  );
}
