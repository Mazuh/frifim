import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BsPlusSquare, BsTrash, BsTable, BsTagFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import LoadingMainContainer from "../loading/LoadingMainContainer";
import { categoriesActions } from "./categoriesDuck";
import useBasicRequestData from "../../app/useBasicRequestData";

export default function CategoriesView() {
  const dispatch = useDispatch();
  const categoriesState = useSelector((s) => s.categories);
  const basicRequestData = useBasicRequestData();

  const [isHelpVisible, setHelpVisible] = React.useState(false);

  if (categoriesState.isReadingAll) {
    return <LoadingMainContainer />
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const creatingCategory = {
      name: event.target.name.value,
      color: event.target.color.value,
    };
    dispatch(categoriesActions.create(creatingCategory, basicRequestData));

    event.target.reset();
  };

  const handleDelete = (category) => {
    if (window.confirm(`Deletar categoria "${category.name}"?`)) {
      dispatch(categoriesActions.delete(category.uuid, basicRequestData));
    }
  }

  return (
    <Container as="main">
      <Row as="header" className="align-items-center mb-2">
        <Col xs="12" sm="10"><h1>Categorias</h1></Col>
        <Col xs="12" sm="auto">
          <Button onClick={() => setHelpVisible(true)} size="sm" variant="outline-secondary">
            O que é isso?
          </Button>
          <Modal show={isHelpVisible} onHide={() => setHelpVisible(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Categorias</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                São <strong>etiquetas</strong> opcionais para agrupar orçamentos
                e transações. Algumas sugestões que podem fazer sentido:
              </p>
              <ul>
                <li>Moradia (para orçar água e energia)</li>
                <li>Alimentação (para orçar feira e lanches)</li>
                <li>Entretenimento (para orçar Netflix e Spotify)</li>
                <li>Saúde (para orçar remédios e plano de saúde)</li>
                <li>Pets (para orçar ração e presentes a bichinhos)</li>
              </ul>
              <p>
                Assim, no fim de cada mês você terá informações mais precisas sobre
                em quais categorias houve exagero, para tomar decisões inteligentes
                a respeito.
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
          <CategoryForm
            onSubmit={handleSubmit}
            isLoading={categoriesState.isLoading}
            isCreating={categoriesState.isCreating}
          />
        </Card.Body>
      </Card>
      {!categoriesState.items.length ? (
        <p>Categorias não encontradas. Crie alguma e organize suas transações e orçamentos!</p>
      ) : (
        <section>
          <header className="card-header bg-dark text-light">
            <h2>
              <BsTable/> Dados
            </h2>
          </header>
          <CategoriesTable
            items={categoriesState.items}
            onDelete={handleDelete}
            deleting={categoriesState.deleting}
          />
        </section>
      )}
    </Container>
  );
}

function CategoryForm({ onSubmit, isLoading, isCreating }) {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group as={Row} controlId="formCategoryName">
        <Form.Label column sm={2}>
          Nome:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            placeholder="Etiqueta curta para orçamentos e transações."
            name="name"
            maxLength={25}
            autoComplete="off"
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formColor">
        <Form.Label column sm={2}>
          Cor:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="color"
            name="color"
            className="w-25"
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit" variant="success" disabled={isLoading}>
            {isCreating ? 'Adicionando...' : 'Adicionar categoria'}
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
}

function CategoriesTable({ items, onDelete, deleting }) {
  return (
    <Table responsive striped bordered hover>
      <thead className="bg-dark text-light">
        <tr>
          <th>Nome</th>
          <th>Cor da etiqueta</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {items.map((category) => (
          <tr key={category.uuid}>
            <td>{category.name}</td>
            <td>
              <BsTagFill style={{ color: category.color }} />
              {" "}
              {category.color}
            </td>
            <td>
              <Button
                variant="danger"
                onClick={() => onDelete(category)}
                disabled={deleting.includes(category.uuid)}
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
