import React from 'react';
import get from 'lodash.get';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { BsBook, BsPlusSquare } from 'react-icons/bs';
import LoadingMainContainer from '../loading/LoadingMainContainer';
import { FLOW_TYPES } from '../categories/constants';
import { weeklyBudgetActions } from './weeklyBudgetDuck';
import BudgetTable from '../monthly-budget/BudgetTable';
import BudgetForm from '../monthly-budget/BudgetForm';
import { WEEK_DAYS } from './constants';
import useBasicRequestData from '../../app/useBasicRequestData';

export default function WeeklyBudgetView() {
  const dispatch = useDispatch();
  const basicRequestData = useBasicRequestData();
  const weeklyBudgetState = useSelector((state) => state.weeklyBudget);
  const [enabledUpdateUuid, setEnabledUpdateUuid] = React.useState(null);

  const [isHelpVisible, setHelpVisible] = React.useState(false);

  if (weeklyBudgetState.isReadingAll) {
    return <LoadingMainContainer />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const creatingBudget = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
      category: event.target.category.value,
      day: parseInt(event.target.day.value, 10),
      month: basicRequestData.month,
      year: basicRequestData.year,
    };
    dispatch(weeklyBudgetActions.create(creatingBudget, basicRequestData));

    event.target.reset();
  };

  const handleUpdate = (budget) => {
    setEnabledUpdateUuid(enabledUpdateUuid === budget.uuid ? null : budget.uuid);
  };

  const handleDelete = (budget) => {
    if (window.confirm(`Deletar do orçamento "${budget.name}"?`)) {
      dispatch(weeklyBudgetActions.delete(budget.uuid, basicRequestData));
    }
  };

  return (
    <Container as="main">
      <Row as="header" className="align-items-center mb-2">
        <Col xs="12" sm="10">
          <h1>Orçamento semanal</h1>
        </Col>
        <Col xs="12" sm="auto">
          <Button onClick={() => setHelpVisible(true)} size="sm" variant="outline-secondary">
            O que é isso?
          </Button>
          <Modal show={isHelpVisible} onHide={() => setHelpVisible(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Orçamento semanal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Semelhante ao orçamento mensal, são <strong>estimativas ou planejamentos</strong> de
                fluxo de dinheiro, mas que se repetem <strong>toda semana</strong>. Ou seja, são
                orçamentos que acontecem <strong>aproximadamente 4 vezes por mês</strong>.
              </p>
              <p>
                Como exemplo de despesa semanal, talvez alguma feira que você faça toda
                quarta-feira.
              </p>
              <p>
                <strong>Atenção</strong>: o total de orçamento semanal irá aparecer magicamente no
                orçamento do mês, já multiplicado por 4.
              </p>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
      <Card as="section" className="mb-3">
        <Card.Header className="bg-dark text-light">
          <Card.Title as="h2">
            <BsPlusSquare /> Criar
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {weeklyBudgetState.items.length < 25 ? (
            <WeeklyBudgetForm
              onSubmit={handleSubmit}
              isLoading={weeklyBudgetState.isLoading}
              isCreating={weeklyBudgetState.isCreating}
            />
          ) : (
            <span>
              <strong>Você já criou muitas linhas de orçamento semanal.</strong>
              <br />O uso é limitado, dada a natureza gratuita do Frifim. Porém caso você realmente
              precise, entre em contato com a manutenção do projeto, e prontamente alguma exceção
              será pensada.
            </span>
          )}
        </Card.Body>
      </Card>
      {!weeklyBudgetState.items.length && (
        <p>O planejamento semanal deste mês não foi encontrado ou não foi criado ainda.</p>
      )}
      {WEEK_DAYS.map((dayEntity) => {
        const itemsByDay = weeklyBudgetState.items.filter((it) => it.day === dayEntity.value);
        return (
          !!itemsByDay.length && (
            <section key={dayEntity.value}>
              <header className="card-header bg-dark text-light">
                <h2>
                  <BsBook /> {dayEntity.label}
                </h2>
              </header>
              {FLOW_TYPES.map((flowType) => {
                const itemsByDayAndFlow = itemsByDay.filter((it) => it.type === flowType.value);
                return (
                  !!itemsByDayAndFlow.length && (
                    <section key={flowType.value}>
                      <header className="card-header bg-secondary text-light">
                        <h3>
                          <flowType.Icon /> {flowType.pluralLabel}
                        </h3>
                      </header>
                      <BudgetTable
                        items={itemsByDayAndFlow}
                        onDelete={handleDelete}
                        deleting={weeklyBudgetState.deleting}
                        onUpdate={handleUpdate}
                        updating={weeklyBudgetState.updating}
                        extendedUuid={enabledUpdateUuid}
                        ExtendedComponent={WeeklyBudgetTableRowExtension}
                      />
                    </section>
                  )
                );
              })}
            </section>
          )
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
          <Form.Control as="select" name="day" defaultValue={get(budget, 'day')} required>
            {WEEK_DAYS.map((dayEntity) => (
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
  const basicRequestData = useBasicRequestData();
  const isUpdating = useSelector((state) => state.weeklyBudget.updating.includes(budget.uuid));
  const isLoading = useSelector((state) => state.weeklyBudget.isLoading);

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatingBudget = {
      uuid: budget.uuid,
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
      category: event.target.category.value,
      day: parseInt(event.target.day.value, 10),
    };
    dispatch(weeklyBudgetActions.update(budget.uuid, updatingBudget, basicRequestData));
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
