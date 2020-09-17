import React from "react";
import Decimal from "decimal.js";
import get from "lodash.get";
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
import useIzitoastForResource from "../izitoast-for-resources/useIzitoastForResource";

export default function MonthlyBudgetView() {
  const dispatch = useDispatch();
  const monthlyBudgetState = useSelector(state => state.monthlyBudget);
  const [enabledUpdateUuid, setEnabledUpdateUuid] = React.useState(null);

  useIzitoastForResource('monthlyBudget');

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

  const handleUpdate = (budget) => {
    setEnabledUpdateUuid(enabledUpdateUuid === budget.uuid ? null : budget.uuid);
  };

  const handleDelete = (budget) => {
    if (window.confirm(`Deletar do orçamento "${budget.name}"?`)) {
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
        <MonthlyBudgetForm
          onSubmit={handleSubmit}
          isLoading={monthlyBudgetState.isLoading}
          isCreating={monthlyBudgetState.isCreating}
        />
      </section>
      <section>
        <h2>{INCOME_TYPE.pluralLabel}</h2>
        <BudgetTable
          items={monthlyBudgetState.items.filter(c => c.type === INCOME_TYPE.value)}
          onDelete={handleDelete}
          deleting={monthlyBudgetState.deleting}
          onUpdate={handleUpdate}
          updating={monthlyBudgetState.updating}
          extendedUuid={enabledUpdateUuid}
          ExtendedComponent={MonthlyBudgetTableRowExtension}
        />
      </section>
      <section>
        <h2>{EXPENSE_TYPE.pluralLabel}</h2>
        <BudgetTable
          items={monthlyBudgetState.items.filter(c => c.type === EXPENSE_TYPE.value)}
          onDelete={handleDelete}
          deleting={monthlyBudgetState.deleting}
          onUpdate={handleUpdate}
          updating={monthlyBudgetState.updating}
          extendedUuid={enabledUpdateUuid}
          ExtendedComponent={MonthlyBudgetTableRowExtension}
        />
      </section>
    </Container>
  );
}

export function BudgetTable({
  items,
  onDelete,
  deleting,
  onUpdate,
  updating,
  extendedUuid,
  ExtendedComponent,
  EmptyComponent = null,
}) {
  if (items.length === 0 && typeof EmptyComponent === 'function') {
    return <EmptyComponent />
  }

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
          <React.Fragment key={budget.uuid}>
            <tr>
              <td>{budget.name}</td>
              <td>R$ {budget.amount}</td>
              <td>
                <Button
                  onClick={() => onUpdate(budget)}
                  disabled={updating.includes(budget.uuid)}
                  size="sm"
                  className="mb-1 mr-1"
                >
                  Alterar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(budget)}
                  disabled={deleting.includes(budget.uuid)}
                  size="sm"
                  className="mb-1"
                >
                  Apagar
                </Button>
              </td>
            </tr>
            {extendedUuid === budget.uuid && (
              <tr>
                <td colSpan={3} className="bg-light">
                  <ExtendedComponent budget={budget} />
                </td>
              </tr>
            )}
          </React.Fragment>
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

export function BudgetForm({ children, onSubmit, isLoading, isCreating, isUpdating, budget }) {
  const isUpdateMode = !!(budget && budget.uuid);

  const getSubmitLabel = () => {
    if (isUpdateMode) {
      return isUpdating ? 'Alterando...' : 'Alterar no orçamento';
    } else {
      return isCreating ? 'Adicionando...' : 'Adicionar ao orçamento';
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group as={Row} controlId="formMonthlyBudgetName">
        <Form.Label column sm={2}>
          Nome:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            placeholder="Para intitular uma entrada de orçamento."
            name="name"
            maxLength={50}
            defaultValue={get(budget, 'name')}
            required
          />
        </Col>
      </Form.Group>
      <Row className="mb-2">
        <Form.Label sm={2} column>
          Quantia:
        </Form.Label>
        <Col sm={10}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>R$</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="number"
              placeholder="Valor planejado (até 2 casas decimais para centavos)."
              name="amount"
              step=".01"
              min={0}
              defaultValue={get(budget, 'amount')}
              required
            />
          </InputGroup>
        </Col>
      </Row>
      <FlowTypeSelectionFieldset
        idPrefix={isUpdateMode ? budget.uuid : 'form'}
        defaultValue={get(budget, 'type')}
      />
      {children}
      <Form.Group as={Row}>
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit" variant={isUpdateMode ? 'warning' : 'success'} disabled={isLoading}>
            {getSubmitLabel()}
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
}

const MonthlyBudgetForm = BudgetForm;

function MonthlyBudgetTableRowExtension({ budget }) {
  const dispatch = useDispatch();
  const isUpdating = useSelector(state => state.monthlyBudget.updating.includes(budget.uuid));
  const isLoading = useSelector(state => state.monthlyBudget.isLoading);

  const handleSubmit = (event) => {
    event.preventDefault();

    const creatingBudget = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
    };
    dispatch(monthlyBudgetActions.update(budget.uuid, creatingBudget));
  };

  return (
    <MonthlyBudgetForm
      budget={budget}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isUpdating={isUpdating}
    />
  );
}
