import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BsPlusSquare, BsTrash, BsTable, BsTagFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import LoadingMainContainer from "../loading/LoadingMainContainer";
import { categoriesActions } from "./categoriesDuck";
import useBasicRequestData from "../../app/useBasicRequestData";

export default function CategoriesView() {
  const dispatch = useDispatch();
  const categoriesState = useSelector((s) => s.categories);
  const basicRequestData = useBasicRequestData();

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
      <header>
        <h1>Categorias</h1>
      </header>
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
  if (items.length === 0) {
    return <p>Categorias não encontradas.</p>;
  }

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
