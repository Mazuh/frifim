import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { MdOutlinePendingActions } from 'react-icons/md';
import useBasicRequestData from '../../app/useBasicRequestData';
import { monthlyBudgetActions } from '../monthly-budget/monthlyBudgetDuck';

export default function PendingBudgetsCard({ budgets }) {
  const dispatch = useDispatch();
  const basicRequestData = useBasicRequestData();

  const hideBudget = (budgetData) => () => {
    const updatingBudget = {
      ...budgetData,
      rememberOnDashboard: false,
      uuid: budgetData.uuid,
    };
    dispatch(monthlyBudgetActions.update(budgetData.uuid, updatingBudget, basicRequestData));
  };

  return (
    <Card>
      <Card.Header className="bg-dark text-light">
        <Card.Title as="h2">
          <MdOutlinePendingActions /> Orçamentos pendentes
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <ul>
          {budgets.map((budget) => (
            <li className="d-flex justify-content-between my-2" key={budget.uuid}>
              <span>{budget.name}</span>
              <div>
                <Button variant="link text-success mr-2">Feito</Button>
                <Button variant="link text-danger" onClick={hideBudget(budget)}>
                  Não lembrar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
}
