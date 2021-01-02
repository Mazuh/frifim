import React from "react";
import orderBy from "lodash.orderby";
import debounce from "lodash.debounce";
import uniqBy from "lodash.uniqby";
import { useSelector, useDispatch } from "react-redux";
import iziToast from "izitoast";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { BsBoxArrowInDownRight, BsPlusSquare, BsTable, BsTrash } from "react-icons/bs";
import { EXPENSE_TYPE, INCOME_TYPE } from "../categories/constants";
import LoadingContainer from "../loading/LoadingContainer";
import { transactionsActions } from "./transactionsDuck";
import BudgetForm from "../monthly-budget/BudgetForm";
import { humanizeDatetime, currentDatetimeValue } from "./dates";
import CategoryIndicator from "../categories/CategoryIndicator";
import { ViewportContext } from "../../app/contexts";

export default function TransactionsView() {
  const dispatch = useDispatch();
  const transactionsState = useSelector((s) => s.transactions);

  if (transactionsState.isReadingAll) {
    return <LoadingContainer />
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const formElement = event.target;
    const creatingTransaction = {
      name: formElement.name.value,
      amount: formElement.amount.value,
      type: formElement.type.value,
      category: formElement.category.value,
      datetime: formElement.datetime.value,
    };
    dispatch(transactionsActions.create(creatingTransaction));
  };

  const handleDelete = (transaction) => {
    const what = transaction.name;
    const when = humanizeDatetime(transaction.datetime, { month: 'long', year: 'numeric' });
    if (window.confirm(`Deletar transação "${what}" de ${when}?`)) {
      dispatch(transactionsActions.delete(transaction.uuid));
    }
  }

  return (
    <Container as="main">
      <header>
        <h1>Transações</h1>
      </header>
      <Card as="section" className="mb-3">
        <Card.Header className="bg-dark text-light">
          <Card.Title as="h2">
            <BsPlusSquare /> Criar
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <TransactionForm
            onSubmit={handleSubmit}
            isLoading={transactionsState.isLoading}
            isCreating={transactionsState.isCreating}
          />
        </Card.Body>
      </Card>
      <section>
        <header className="card-header bg-dark text-light">
          <h2>
            <BsTable /> Dados
          </h2>
        </header>
        <TransactionsTable
          items={transactionsState.items}
          onDelete={handleDelete}
          deleting={transactionsState.deleting}
        />
      </section>
    </Container>
  );
}

function TransactionForm(props) {
  const { isMobile } = React.useContext(ViewportContext);
  const [isImportingVisible, setImportingVisible] = React.useState(false);

  const handleClose = () => setImportingVisible(false);
  const handleShow = () => setImportingVisible(true);

  const [importedBudget, setImportedBudget] = React.useState(null);
  const clearBudgetSelect = () => setImportedBudget(null);
  const handleBudgetSelect = (importing) => {
    setImportedBudget(importing);

    handleClose();

    iziToast.show({
      title: 'Importado!',
      message: 'Finalize o formulário agora, ou faça adaptações.',
      color: 'blue',
      position: isMobile ? 'bottomCenter' : 'topRight',
      timeout: 3500,
    });
  };

  const handleSelectedBudgetEffect = (formRef) => {
    formRef.current.datetime.value = currentDatetimeValue();
  };

  const { uuid, ...budget } = props.budget || importedBudget || {};
  const isUpdateMode = !!(props.budget && props.budget.uuid);
  const idPrefix = isUpdateMode ? props.budget.uuid : 'form';

  const getFormSubmitLabel = (isUpdateMode, isUpdating, isCreating) => {
    if (isUpdateMode) {
      return isUpdating ? 'Alterando...' : 'Alterar transação';
    } else {
      return isCreating ? 'Adicionando...' : 'Adicionar transação';
    }
  };

  return (
    <>
      <Row className="mb-3">
        <Col sm={2} className="d-flex align-items-center">
          <p>
            Já estava planejado?
          </p>
        </Col>
        <Col xs={10} sm={10}>
          <small className="text-muted">
            Sem digitar nada! <span role="img" aria-label="Blink emoji">😉</span>
          </small>
          <br />
          <Button variant="outline-secondary" onClick={handleShow}>
            <BsBoxArrowInDownRight /> Preencher via orçamento
          </Button>
        </Col>
      </Row>

      <Modal show={isImportingVisible} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Importe um orçamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BudgetsSearcher onBudgetSelect={handleBudgetSelect} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <BudgetForm
        {...props}
        budget={budget}
        getSubmitCustomLabel={getFormSubmitLabel}
        onFormInit={handleSelectedBudgetEffect}
        onSubmit={(...args) => props.onSubmit(...args) & clearBudgetSelect()}
      >
        <Form.Group as={Row} controlId={`${idPrefix}budgetDate`}>
          <Form.Label column sm={2}>
            Data:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="datetime-local"
              name="datetime"
              required
            />
          </Col>
        </Form.Group>
      </BudgetForm>
    </>
  );
}

function TransactionsTable({ items, onDelete, deleting }) {
  if (items.length === 0) {
    return <p>Transações não encontradas.</p>;
  }

  const orderedItems = orderBy(items, it => (new Date(it.date)).valueOf(), 'desc');

  return (
    <Table responsive striped bordered hover>
      <thead className="bg-dark text-light">
        <tr>
          <th>Nome</th>
          <th>Data</th>
          <th>Quantia</th>
          <th>Categoria</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {orderedItems.map((transaction) => (
          <tr key={transaction.uuid}>
            <td>{transaction.name}</td>
            <td>{humanizeDatetime(transaction.datetime)}</td>
            <td
              title={transaction.type === INCOME_TYPE.value ? INCOME_TYPE.label : EXPENSE_TYPE.label}
              className={transaction.type === INCOME_TYPE.value ? "text-info" : "text-danger"}
            >
              {transaction.type === INCOME_TYPE.value ? (
                <INCOME_TYPE.Icon />
              ) : (
                <EXPENSE_TYPE.Icon />
              )}
              <span> R$ {transaction.amount} </span>
            </td>
            <td><CategoryIndicator categoryUUID={transaction.category} /></td>
            <td>
              <Button
                variant="danger"
                onClick={() => onDelete(transaction)}
                disabled={deleting.includes(transaction.uuid)}
                size="sm"
              >
                <BsTrash /> Apagar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function BudgetsSearcher({ onBudgetSelect }) {
  const [searchCriteria, unsafelySetSearchCriteria] = React.useState('');
  const setSearchCriteria = React.useCallback(debounce((nextSearch) => {
    unsafelySetSearchCriteria(nextSearch);
  }, 200));

  const weeklyBudgetItems = useSelector(state => state.weeklyBudget.items);
  const monthlyBudgetItems = useSelector(state => state.monthlyBudget.items);

  const loweredSearchCriteria = searchCriteria.toLowerCase();
  const reduceToSearched = (anyBudgets, tag) => anyBudgets.reduce((acc, currentBudget) => (
    currentBudget.name.toLowerCase().includes(loweredSearchCriteria)
      ? [...acc, { ...currentBudget, tag }]
      : acc
  ), []);
  const budgets = uniqBy([
    ...reduceToSearched(weeklyBudgetItems, 'Semanal'),
    ...reduceToSearched(monthlyBudgetItems, 'Mensal'),
  ], it => [it.name, it.tag, it.type, it.value, it.category].join());

  return (
    <div className="budgets-searcher">
      <Form.Group controlId="formBasicEmail">
        <Form.Label>
          Parte do nome do planejamento:
        </Form.Label>
        <Form.Control
          type="search"
          placeholder="Filtre a pesquisa..."
          onChange={event => setSearchCriteria(event.target.value)}
          autoComplete="off"
        />
        <Form.Text className="text-muted">
          Deve existir nas tabelas semanal ou mensal.
        </Form.Text>
      </Form.Group>
      {budgets.length > 0 ? (
        <>
          <p>
            Escolha ({budgets.length} encontrados):
          </p>
          <ListGroup>
            {budgets.map(budget => (
              <ListGroup.Item
                key={budget.uuid}
                href="#"
                onClick={() => onBudgetSelect(budget)}
                action
              >
                <span title="Clique para selecionar">{budget.name}</span>
                {' '}
                <Badge variant="secondary" title="De qual planejamento essa sugestão veio">
                  {budget.tag}
                </Badge>
                {' '}
                {budget.type === INCOME_TYPE.value ? (
                  <Badge variant="info" title={INCOME_TYPE.label}>
                    R$ {budget.amount} <INCOME_TYPE.Icon />
                  </Badge>
                ) : (
                  <Badge variant="danger" title={EXPENSE_TYPE.label}>
                    R$ {budget.amount} <EXPENSE_TYPE.Icon />
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      ) : (
        <p>
          Nada encontrado.
        </p>
      )}
    </div>
  );
}
