import React from "react";
import get from "lodash.get";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useSelector, useDispatch } from "react-redux";
import { BsBook, BsPlusSquare } from "react-icons/bs";
import LoadingContainer from "../loading/LoadingContainer";
import { FLOW_TYPES } from "../categories/constants";
import { weeklyBudgetActions } from "./weeklyBudgetDuck";
import useIzitoastForResource from "../izitoast-for-resources/useIzitoastForResource";
import BudgetTable from "../monthly-budget/BudgetTable";
import BudgetForm from "../monthly-budget/BudgetForm";
import { WEEK_DAYS } from "./constants";

export default function WeeklyBudgetView() {
  const dispatch = useDispatch();
  const weeklyBudgetState = useSelector(state => state.weeklyBudget);
  const [enabledUpdateUuid, setEnabledUpdateUuid] = React.useState(null);

  useIzitoastForResource('weeklyBudget');

  if (weeklyBudgetState.isReadingAll) {
    return <LoadingContainer />
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const creatingBudget = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
      day: parseInt(event.target.day.value, 10),
    };
    dispatch(weeklyBudgetActions.create(creatingBudget));

    event.target.reset();
  };

  const handleUpdate = (budget) => {
    setEnabledUpdateUuid(enabledUpdateUuid === budget.uuid ? null : budget.uuid);
  };

  const handleDelete = (budget) => {
    if (window.confirm(`Deletar do orçamento "${budget.name}"?`)) {
      dispatch(weeklyBudgetActions.delete(budget.uuid));
    }
  }

  return (
    <Container as="main">
      <header>
        <h1>Orçamento semanal</h1>
      </header>
      <section>
        <h2><BsPlusSquare /> Criar</h2>
        <WeeklyBudgetForm
          onSubmit={handleSubmit}
          isLoading={weeklyBudgetState.isLoading}
          isCreating={weeklyBudgetState.isCreating}
        />
      </section>
      {!weeklyBudgetState.items.length && (
        <p>Nenhum planejamento semanal encontrado.</p>
      )}
      {WEEK_DAYS.map((dayEntity) => {
        const itemsByDay = weeklyBudgetState.items.filter(it => it.day === dayEntity.value);
        return !!itemsByDay.length && (
          <section key={dayEntity.value}>
            <h2><BsBook /> {dayEntity.label}</h2>
            {FLOW_TYPES.map((flowType) => {
              const itemsByDayAndFlow = itemsByDay.filter(it => it.type === flowType.value);
              return !!itemsByDayAndFlow.length && (
                <section key={flowType.value}>
                  <h3><flowType.Icon /> {flowType.pluralLabel}</h3>
                  <BudgetTable
                    items={itemsByDayAndFlow}
                    onDelete={(handleDelete)}
                    deleting={weeklyBudgetState.deleting}
                    onUpdate={handleUpdate}
                    updating={weeklyBudgetState.updating}
                    extendedUuid={enabledUpdateUuid}
                    ExtendedComponent={WeeklyBudgetTableRowExtension}
                  />
                </section>
              );
            })}
          </section>
        );
      })}
    </Container>
  );
}

function WeeklyBudgetForm(props) {
  const { budget } = props;

  const isUpdateMode = !!(budget && budget.uuid);
  const idPrefix = isUpdateMode ? budget.uuid : 'form';

  return (
    <BudgetForm {...props}>
      <Form.Group as={Row} controlId={`${idPrefix}WeekDay`}>
        <Form.Label column sm={2}>
          Dia:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            as="select"
            name="day"
            defaultValue={get(budget, 'day')}
            required
          >
            <option value="">--- Escolha o dia da semana (obrigatório) ---</option>
            {WEEK_DAYS.map(dayEntity => (
              <option key={dayEntity.value} value={dayEntity.value}>
                {dayEntity.label}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>
    </BudgetForm>
  );
}

function WeeklyBudgetTableRowExtension({ budget }) {
  const dispatch = useDispatch();
  const isUpdating = useSelector(state => state.weeklyBudget.updating.includes(budget.uuid));
  const isLoading = useSelector(state => state.weeklyBudget.isLoading);

  const handleSubmit = (event) => {
    event.preventDefault();

    const creatingBudget = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
      day: parseInt(event.target.day.value, 10),
    };
    dispatch(weeklyBudgetActions.update(budget.uuid, creatingBudget));
  };

  return (
    <WeeklyBudgetForm
      budget={budget}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isUpdating={isUpdating}
    />
  );
}
