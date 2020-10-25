import React from "react";
import orderBy from "lodash.orderby";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BsArrowDown, BsBoxArrowInDownRight, BsPlusSquare, BsTable, BsTrash } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { EXPENSE_TYPE, INCOME_TYPE } from "../categories/constants";
import LoadingContainer from "../loading/LoadingContainer";
import useIzitoastForResource from "../izitoast-for-resources/useIzitoastForResource";
import { transactionsActions } from "./transactionsDuck";
import BudgetForm from "../monthly-budget/BudgetForm";

export default function TransactionsView() {
  const dispatch = useDispatch();
  const transactionsState = useSelector((s) => s.transactions);

  useIzitoastForResource('transactions');

  if (transactionsState.isReadingAll) {
    return <LoadingContainer />
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const creatingTransaction = {
      name: event.target.name.value,
      type: event.target.type.value,
      amount: event.target.amount.value,
    };
    dispatch(transactionsActions.create(creatingTransaction));

    event.target.reset();
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
      <section>
        <h2><BsPlusSquare /> Criar</h2>
        <TransactionForm
          onSubmit={handleSubmit}
          isLoading={transactionsState.isLoading}
          isCreating={transactionsState.isCreating}
        />
      </section>
      <section>
        <h2><BsTable /> Dados</h2>
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
  const { budget } = props;
  const isUpdateMode = !!(budget && budget.uuid);

  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            Preencha o formulário sem digitar nada!
          </small>
          <br />
          <Button variant="outline-secondary" onClick={handleShow}>
            <BsBoxArrowInDownRight /> Preencher via orçamento
          </Button>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Importe um orçamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Parte do nome do planejamento:</Form.Label>
          <Form.Control type="search" placeholder="Pesquise aqui..." />
        </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <BudgetForm {...props} />
    </>
  );
}

function TransactionsTable({ items, onDelete, deleting }) {
  if (items.length === 0) {
    return <p>Transações não encontradas.</p>;
  }

  const orderedItems = orderBy(items, it => (new Date(it.date)).valueOf(), 'desc');

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nome</th>
          <th title="As datas mais recentes aparecem no topo da tabela.">Data <BsArrowDown /></th>
          <th>Quantia</th>
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

function humanizeDatetime(isoDatetimeString, options = {}) {
  return (new Date(isoDatetimeString)).toLocaleString(navigator.language, {
    day: 'numeric',
    month: 'short',
    ...options,
  });
}
