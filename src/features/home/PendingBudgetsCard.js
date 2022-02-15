import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';
import { useDispatch } from 'react-redux';
import { MdOutlinePendingActions } from 'react-icons/md';
import useBasicRequestData from '../../app/useBasicRequestData';
import { monthlyBudgetActions } from '../monthly-budget/monthlyBudgetDuck';
import { transactionsActions } from '../transactions/transactionsDuck';
import { EXPENSE_TYPE } from '../categories/constants';

export default function PendingBudgetsCard({ budgets }) {
  const [showOthers, setShowOthers] = React.useState(false);
  const dispatch = useDispatch();
  const basicRequestData = useBasicRequestData();

  const onHideBudget = (budgetData) => () => {
    const updatingBudget = {
      ...budgetData,
      rememberOnDashboard: false,
      uuid: budgetData.uuid,
    };
    dispatch(monthlyBudgetActions.update(budgetData.uuid, updatingBudget, basicRequestData));
  };

  const onConsolidateBudget = (budgetData) => () => {
    const defaultData = {
      amount: budgetData.amount,
      datetime: new Date().toISOString(),
      name: budgetData.name,
    };

    const transactionData =
      budgetData.uuid === 'emergency-value'
        ? {
            ...defaultData,
            category: '',
            project: basicRequestData.project,
            type: EXPENSE_TYPE.value,
          }
        : {
            ...defaultData,
            category: budgetData.category,
            project: budgetData.project,
            type: budgetData.type,
          };
    dispatch(transactionsActions.create(transactionData, basicRequestData));
  };

  return (
    <Card>
      <Card.Header className="bg-dark text-light d-flex justify-content-between">
        <Card.Title as="h2">
          <MdOutlinePendingActions /> Orçamentos pendentes
        </Card.Title>
        {budgets.length > 3 && (
          <Button
            className="text-light"
            onClick={() => setShowOthers(!showOthers)}
            variant="link"
            aria-controls="collapse-list"
            aria-expanded={showOthers}
          >
            {!showOthers ? 'Ver todos' : 'Ver menos'}
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {budgets.slice(0, 3).map((budget) => (
            <ListGroup.Item key={budget.uuid}>
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
                  {budget.uuid !== 'emergency-value' && (
                    <Button className="text-danger" variant="link" onClick={onHideBudget(budget)}>
                      Não lembrar
                    </Button>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
        {budgets.length > 3 && (
          <Collapse in={showOthers}>
            <ListGroup className="border-top" variant="flush" id="collapse-list">
              {budgets.slice(3).map((budget) => (
                <ListGroup.Item key={budget.uuid}>
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
          </Collapse>
        )}
      </Card.Body>
    </Card>
  );
}
