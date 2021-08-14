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
  const basicRequestData = useBasicRequestData();

  const handleUpdateData = () => {
    setLastUpdate(new Date().toLocaleString());
    dispatch(categoriesActions.readAll(basicRequestData));
    dispatch(monthlyBudgetActions.readAll(basicRequestData));
    dispatch(weeklyBudgetActions.readAll(basicRequestData));
    dispatch(transactionsActions.readAll(basicRequestData));
  };

  return (
    <Button className={className} variant="secondary" onClick={handleUpdateData}>
      <span>Atualizar dados</span>
    </Button>
  );
}
