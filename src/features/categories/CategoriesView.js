import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BsPlusSquare, BsTrash, BsTagFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { EXPENSE_TYPE, INCOME_TYPE } from "./constants";
import LoadingContainer from "../loading/LoadingContainer";
import { categoriesActions } from "./categoriesDuck";
import useIzitoastForResource from "../izitoast-for-resources/useIzitoastForResource";

export default function CategoriesView() {
  const dispatch = useDispatch();
  const categoriesState = useSelector((s) => s.categories);

  useIzitoastForResource('categories');

  if (categoriesState.isReadingAll) {
    return <LoadingContainer />
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const creatingCategory = {
      name: event.target.name.value,
      type: event.target.type.value,
      color: event.target.color.value,
    };
    dispatch(categoriesActions.create(creatingCategory));

    event.target.reset();
  };

  const handleDelete = (category) => {
    if (window.confirm(`Deletar categoria "${category.name}"?`)) {
      dispatch(categoriesActions.delete(category.uuid));
    }
  }

  return (
    <Container as="main">
      <header>
        <h1>Categorias</h1>
      </header>
      <section>
        <h2><BsPlusSquare /> Criar</h2>
        <CategoryForm
          onSubmit={handleSubmit}
          isLoading={categoriesState.isLoading}
          isCreating={categoriesState.isCreating}
        />
      </section>
      <section>
        <h2><INCOME_TYPE.Icon /> {INCOME_TYPE.pluralLabel}</h2>
        <CategoriesTable
          items={categoriesState.items.filter(c => c.type === INCOME_TYPE.value)}
          onDelete={handleDelete}
          deleting={categoriesState.deleting}
        />
      </section>
      <section>
        <h2><EXPENSE_TYPE.Icon /> {EXPENSE_TYPE.pluralLabel}</h2>
        <CategoriesTable
          items={categoriesState.items.filter(c => c.type === EXPENSE_TYPE.value)}
          onDelete={handleDelete}
          deleting={categoriesState.deleting}
        />
      </section>
    </Container>
  );
}

export function FlowTypeSelectionFieldset({ idPrefix='form', defaultValue = null }) {
  return (
    <fieldset>
      <Form.Group as={Row}>
        <Form.Label as="legend" column sm={2}>
          Tipo:
        </Form.Label>
        <Col sm={10}>
          <Form.Check
            type="radio"
            name="type"
            label={<>{INCOME_TYPE.label} <INCOME_TYPE.Icon className="text-info" /> </>}
            value={INCOME_TYPE.value}
            id={`${idPrefix}CategoryIncome`}
            defaultChecked={defaultValue === INCOME_TYPE.value}
            required
          />
          <Form.Check
            type="radio"
            name="type"
            label={<>{EXPENSE_TYPE.label} <EXPENSE_TYPE.Icon className="text-danger" /> </>}
            value={EXPENSE_TYPE.value}
            id={`${idPrefix}CategoryExpense`}
            defaultChecked={defaultValue === EXPENSE_TYPE.value}
            required
          />
        </Col>
      </Form.Group>
    </fieldset>
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
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formColor">
        <Form.Label column sm={2}>
          Nome:
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
      <FlowTypeSelectionFieldset />
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
    <Table striped bordered hover>
      <thead>
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
