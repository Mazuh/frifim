import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { useDispatch } from 'react-redux';
import { MdOutlinePendingActions } from 'react-icons/md';
import useBasicRequestData from '../../app/useBasicRequestData';
import { monthlyBudgetActions } from '../monthly-budget/monthlyBudgetDuck';
import { transactionsActions } from '../transactions/transactionsDuck';

export default function PendingBudgetsCard({ budgets }) {
  const dispatch = useDispatch();
  const basicRequestData = useBasicRequestData();

  const forgetBudget = (budgetData) => {
    const updatingBudget = {
      ...budgetData,
      rememberOnDashboard: false,
      uuid: budgetData.uuid,
    };
    dispatch(monthlyBudgetActions.update(budgetData.uuid, updatingBudget, basicRequestData));
  };

  const createTransaction = (budgetData) => {
    const transactionData = {
      amount: budgetData.amount,
      category: budgetData.category,
      datetime: new Date().toISOString(),
      name: budgetData.name,
      project: budgetData.project,
      type: budgetData.type,
    };
    dispatch(transactionsActions.create(transactionData, basicRequestData));
  };

  const onHideBudget = (budgetData) => () => forgetBudget(budgetData);
  const onConsolidateBudget = (budgetData) => () => {
    forgetBudget(budgetData);
    createTransaction(budgetData);
  };

  return (
    <Card>
      <Card.Header className="bg-dark text-light">
        <Card.Title as="h2">
          <MdOutlinePendingActions /> Orçamentos pendentes
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {budgets.map((budget) => (
            <ListGroup.Item>
              <Row className="d-flex align-items-center" key={budget.uuid}>
                <Col sm={9}>
                  <span>{budget.name}</span>
                </Col>
                <Col sm={3}>
                  <Button
                    className="text-success"
                    variant="link"
                    onClick={onConsolidateBudget(budget)}
                  >
                    Feito
                  </Button>
                  <Button className="text-danger" variant="link" onClick={onHideBudget(budget)}>
                    Não lembrar
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
