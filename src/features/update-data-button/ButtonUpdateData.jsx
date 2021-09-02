import React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { BsArrowRepeat } from 'react-icons/bs';
import { LastUpdateContext } from '../../app/contexts';
import useBasicRequestData from '../../app/useBasicRequestData';
import { categoriesActions } from '../categories/categoriesDuck';
import { monthlyBudgetActions } from '../monthly-budget/monthlyBudgetDuck';
import { transactionsActions } from '../transactions/transactionsDuck';
import { weeklyBudgetActions } from '../weekly-budget/weeklyBudgetDuck';

const RESOURCES = ['transactions', 'monthlyBudget', 'weeklyBudget', 'categories', 'projects'];

export default function ButtonUpdateData({ className }) {
  const dispatch = useDispatch();
  const { setLastUpdate } = React.useContext(LastUpdateContext);
  const [disabled, setDisabled] = React.useState(false);
  const messages = useSelector((state) =>
    RESOURCES.map((resource) => state[resource].currentMessage)
  );
  const basicRequestData = useBasicRequestData();

  const handleUpdateData = () => {
    dispatch(categoriesActions.readAll(basicRequestData));
    dispatch(monthlyBudgetActions.readAll(basicRequestData));
    dispatch(weeklyBudgetActions.readAll(basicRequestData));
    dispatch(transactionsActions.readAll(basicRequestData));
    setDisabled(true);
    const isAnyError = messages.some((message) => !message || message.isError);

    if (!isAnyError) {
      setLastUpdate(new Date());
    }
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
      className={`d-flex align-items-center ${className}`}
      variant="outline-secondary"
      disabled={disabled}
      onClick={handleUpdateData}
      size="sm"
    >
      <BsArrowRepeat className="mr-1" title="Recarregar dados" />
      <span>Recarregar</span>
    </Button>
  );
}
