import React from "react";
import Decimal from "decimal.js";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { useSelector, useDispatch } from "react-redux";
import { FlowTypeSelectionFieldset } from "../categories/CategoriesView";
import LoadingContainer from "../loading/LoadingContainer";
import { EXPENSE_TYPE, INCOME_TYPE } from "../categories/constants";
import { monthlyBudgetActions } from "./monthlyBudgetDuck";

export default function MonthlyBudgetView() {
  const dispatch = useDispatch();
  const monthlyBudgetState = useSelector(state => state.monthlyBudget);

  if (monthlyBudgetState.isReadingAll) {
    return <LoadingContainer />
  }

  const handleSubmit = (event) => {
    event.preventDefault();


    const creatingBudget = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
    };
    dispatch(monthlyBudgetActions.create(creatingBudget));

    event.target.reset();
  };

  const handleDelete = (budget) => {
    if (window.confirm(`Deletar orçamento "${budget.name}"?`)) {
      dispatch(monthlyBudgetActions.delete(budget.uuid));
    }
  }

  return (
    <Container as="main">
      <header>
        <h1>Orçamento mensal</h1>
      </header>
      <section>
        <h2>Criar</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="formMonthlyBudgetName">
            <Form.Label column sm={2}>
              Nome:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                placeholder="Para intitular uma entrada de orçamento."
                name="name"
                maxLength={50}
                required
              />
            </Col>
          </Form.Group>
          <Row className="mb-2">
            <Form.Label sm={2} column>
              Quantia:
            </Form.Label>
            <InputGroup className="col-sm-10">
              <InputGroup.Prepend>
                <InputGroup.Text>R$</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="number"
                placeholder="Valor planejado (até 2 casas decimais para centavos)."
                name="amount"
                step=".01"
                min={0}
                required
              />
            </InputGroup>
          </Row>
          <FlowTypeSelectionFieldset />
          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit" disabled={monthlyBudgetState.isLoading}>
                {monthlyBudgetState.isCreating ? 'Adicionando...' : 'Adicionar orçamento'}
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </section>
      <section>
        <h2>{INCOME_TYPE.pluralLabel}</h2>
        <MonthlyBudgetTable
          items={monthlyBudgetState.items.filter(c => c.type === INCOME_TYPE.value)}
          onDelete={handleDelete}
          deleting={monthlyBudgetState.deleting}
        />
      </section>
      <section>
        <h2>{EXPENSE_TYPE.pluralLabel}</h2>
        <MonthlyBudgetTable
          items={monthlyBudgetState.items.filter(c => c.type === EXPENSE_TYPE.value)}
          onDelete={handleDelete}
          deleting={monthlyBudgetState.deleting}
        />
      </section>
    </Container>
  );
}

function MonthlyBudgetTable({ items, onDelete, deleting }) {
  const total = items.reduce((acc, budget) => acc.plus(budget.amount), Decimal(0)).toFixed(2);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Quantia</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {items.map((budget) => (
          <tr key={budget.uuid}>
            <td>{budget.name}</td>
            <td>R$ {budget.amount}</td>
            <td>
              <Button
                variant="danger"
                onClick={() => onDelete(budget)}
                disabled={deleting.includes(budget.uuid)}
              >
                Apagar
              </Button>
            </td>
          </tr>
        ))}
        <tr>
          <td><strong>Total</strong></td>
          <td><strong>R$ {total}</strong></td>
          <td>{' '}</td>
        </tr>
      </tbody>
    </Table>
  );
}
