import React, { useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { Typeahead } from 'react-bootstrap-typeahead';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import { BsPlusSquare, BsTrash, BsTable, BsTagFill } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import LoadingMainContainer from '../loading/LoadingMainContainer';
import { categoriesActions } from './categoriesDuck';
import useBasicRequestData from '../../app/useBasicRequestData';
import { defaultCategories } from './constants';
import { invalidActionToast, validateProject } from '../../utils/project-utils';
import { ViewportContext } from '../../app/contexts';

export default function CategoriesView() {
  const dispatch = useDispatch();
  const categoriesState = useSelector((s) => s.categories);
  const basicRequestData = useBasicRequestData();
  const { isMobile } = React.useContext(ViewportContext);

  const [isHelpVisible, setHelpVisible] = React.useState(false);

  if (categoriesState.isReadingAll) {
    return <LoadingMainContainer />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValidProject = await validateProject(basicRequestData);
    if (!isValidProject) {
      invalidActionToast(isMobile);
      return;
    }

    const creatingCategory = {
      name: event.target.name.value,
      color: event.target.color.value,
    };
    dispatch(categoriesActions.create(creatingCategory, basicRequestData));

    event.target.reset();
  };

  const addCategorySuggested = async (suggestedCategory) => {
    const isValidProject = await validateProject(basicRequestData);
    if (!isValidProject) {
      invalidActionToast(isMobile);
      return;
    }
    dispatch(categoriesActions.create(suggestedCategory, basicRequestData));
  };

  const handleDelete = async (category) => {
    const isValidProject = await validateProject(basicRequestData);
    if (!isValidProject) {
      invalidActionToast(isMobile);
      return;
    }

    if (window.confirm(`Deletar categoria "${category.name}"?`)) {
      dispatch(categoriesActions.delete(category.uuid, basicRequestData));
    }
  };

  return (
    <Container as="main">
      <Row as="header" className="align-items-center mb-2">
        <Col xs="12" sm="10">
          <h1>Categorias</h1>
        </Col>
        <Col xs="12" sm="auto">
          <Button onClick={() => setHelpVisible(true)} size="sm" variant="outline-info">
            O que é isso?
          </Button>
          <Modal show={isHelpVisible} onHide={() => setHelpVisible(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Categorias</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                São <strong>etiquetas</strong> opcionais para agrupar orçamentos e transações.
                Sugestões:
              </p>
              <ul>
                <li>Moradia (água, energia, pets, móveis, serviços domésticos)</li>
                <li>Transporte (uso de Uber, carro, ônibus)</li>
                <li>Educação (escola, faculdade, livros, cursos)</li>
                <li>Alimentação (feira, lanches, iFood)</li>
                <li>Saúde (remédios e plano de saúde)</li>
                <li>Lazer (para orçar Netflix e Spotify)</li>
              </ul>
              <p>
                Assim, no fim de cada mês você terá informações mais precisas sobre em quais
                categorias houve exagero, para tomar decisões inteligentes a respeito.
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
          {categoriesState.items.length < 10 ? (
            <CategoryForm
              onSubmit={handleSubmit}
              addCategorySuggested={addCategorySuggested}
              isLoading={categoriesState.isLoading}
              isCreating={categoriesState.isCreating}
              categories={categoriesState.items}
            />
          ) : (
            <span>
              <strong>Você já criou muitas categorias.</strong>
              <br />O uso é limitado, dada a natureza gratuita do Frifim. Porém caso você realmente
              precise, entre em contato com a manutenção do projeto, e prontamente alguma exceção
              será pensada.
            </span>
          )}
        </Card.Body>
      </Card>
      {!categoriesState.items.length ? (
        <p>Categorias não encontradas. Crie alguma e organize suas transações e orçamentos!</p>
      ) : (
        <section>
          <header className="card-header bg-dark text-light">
            <h2>
              <BsTable /> Dados
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

function CategoryForm({
  onSubmit,
  addCategorySuggested,
  isLoading,
  isCreating,
  categories: existingCategories,
}) {
  const typeaheadRef = useRef();

  const handleSubmit = (event) => {
    event.persist();
    onSubmit(event);
    typeaheadRef.current.clear();
  };

  const filteredCategories = defaultCategories.filter(
    (category) =>
      !existingCategories.some(
        (existingCategory) =>
          existingCategory.name.trim().toLowerCase() === category.name.trim().toLowerCase()
      )
  );

  return (
    <Form onSubmit={handleSubmit}>
      {filteredCategories.length > 0 && (
        <Form.Group as={Row} controlId="formSuggestion">
          <Form.Label column sm={2}>
            Sugestões:
            <br />
            <small className="text-muted">Clique para adicionar.</small>
          </Form.Label>
          <Col sm={10}>
            {filteredCategories.map((category) => (
              <Badge
                role="button"
                key={category.name}
                className="cursor-pointer p-2"
                style={{
                  backgroundColor: category.color,
                  color: category.textColor,
                  margin: '10px',
                }}
                onClick={() => !isLoading && addCategorySuggested(category)}
                pill
              >
                {category.name}
              </Badge>
            ))}
          </Col>
        </Form.Group>
      )}
      <Form.Group as={Row} controlId="formCategoryName">
        <Form.Label column sm={2}>
          Nome:
        </Form.Label>
        <Col sm={10}>
          <Typeahead
            ref={typeaheadRef}
            placeholder="Etiqueta curta para orçamentos e transações."
            inputProps={{ name: 'name' }}
            id="typeahead"
            maxLength={25}
            autoComplete="off"
            required
            labelKey="name"
            open={filteredCategories.length ? undefined : false}
            options={filteredCategories}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formColor">
        <Form.Label column sm={2}>
          Cor:
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="color" name="color" className="w-25" required />
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
              <BsTagFill style={{ color: category.color }} /> {category.color}
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
