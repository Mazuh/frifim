import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { BsFolder, BsFolderPlus, BsCheck, BsTrashFill } from 'react-icons/bs';
import { ProjectContext } from '../../app/contexts';
import { useDispatch, useSelector } from 'react-redux';
import { projectsActions } from './projectsDuck';
import { setLastSelectedProjectUuid } from '../auth/authDuck';

export default function ProjectSelector({ className }) {
  const dispatch = useDispatch();
  const { project, setProject } = React.useContext(ProjectContext);
  const projectsState = useSelector((s) => s.projects);

  const newProjectSpan = (
    <span>
      <BsFolderPlus /> Novo projeto
    </span>
  );
  const [isCreationVisible, setCreationVisible] = React.useState(false);
  const [isDeletionModalVisible, setDeletionModalVisible] = React.useState(false);
  const [projectForDelete, setProjectForDelete] = React.useState({});
  const openCreation = () => setCreationVisible(true);
  const closeCreation = () => setCreationVisible(false);
  const openDeletionModal = (project) => () => {
    setProjectForDelete(project);
    setDeletionModalVisible(true);
  };
  const closeDeletionModal = () => setDeletionModalVisible(false);

  if (projectsState.items.length < 2) {
    return (
      <>
        <Button
          variant="secondary"
          className={className}
          onClick={openCreation}
          disabled={projectsState.isLoading}
        >
          {projectsState.isLoading ? (
            <>
              <BsFolder /> Carregando...
            </>
          ) : (
            newProjectSpan
          )}
        </Button>
        <CreationModal
          isVisible={isCreationVisible}
          isBlocked={projectsState.isLoading}
          close={closeCreation}
        />
      </>
    );
  }

  const handleSelect = (eventKey) => {
    if (!eventKey || eventKey === 'project-selector-plus') {
      return;
    }

    const projectUUID = eventKey.replace('project-selector_', '');
    const selecting =
      projectsState.items.find((it) => it.uuid === projectUUID) || projectsState.items[0];
    if (!selecting) {
      return;
    }

    setProject(selecting);
    dispatch(setLastSelectedProjectUuid(selecting.uuid));
  };

  const getDropdownLabel = () => {
    if (project) {
      return project.name;
    }

    if (projectsState.isCreating) {
      return 'Criando...';
    }

    if (projectsState.isLoading) {
      return 'Carregando...';
    }

    return 'Projetos';
  };

  return (
    <>
      <DropdownButton
        id="main-projects-dropdown"
        variant="secondary"
        className={className}
        title={getDropdownLabel()}
        disabled={projectsState.isLoading}
        onSelect={handleSelect}
      >
        {projectsState.items.length < 3 && (
          <Dropdown.Item eventKey={'project-selector-plus'} onClick={openCreation}>
            {newProjectSpan}
          </Dropdown.Item>
        )}
        {projectsState.items.map((listingProject) => (
          <div
            className="d-flex justify-content-between align-items-center px-1"
            key={listingProject.uuid}
          >
            <Dropdown.Item eventKey={`project-selector_${listingProject.uuid}`}>
              {listingProject.name}
            </Dropdown.Item>
            {listingProject.uuid === project.uuid ? (
              <Button className="py-1 border-0" variant="light" disabled>
                <BsCheck />
              </Button>
            ) : (
              <Button
                title="Deletar projeto"
                className="py-1 border-0"
                variant="light"
                onClick={openDeletionModal(listingProject)}
              >
                <BsTrashFill />
              </Button>
            )}
          </div>
        ))}
      </DropdownButton>
      <CreationModal
        isVisible={isCreationVisible}
        isBlocked={projectsState.isLoading}
        close={closeCreation}
      />
      <DeletionModal
        isVisible={isDeletionModalVisible}
        project={projectForDelete}
        close={closeDeletionModal}
      />
    </>
  );
}

function CreationModal({ isVisible, isBlocked, close }) {
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = event.target.name.value.trim();
    if (!name) {
      return;
    }

    dispatch(projectsActions.create({ name, createdAt: new Date().toISOString() }));
    close();
  };

  return (
    <Modal show={isVisible} onHide={close}>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Crie um projeto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="projectCreationInput">
            <Form.Label>Projeto:</Form.Label>
            <Form.Control
              placeholder="Nome do novo projeto..."
              autoComplete="off"
              name="name"
              minLength={3}
              maxLength={20}
              required
            />
            <Form.Text className="text-muted">
              Cada projeto tem seu orçamento, transações e configurações.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isBlocked}>
            Criar
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

function DeletionModal({ isVisible, project, close }) {
  return (
    <Modal show={isVisible} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Deletar projeto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {`Tem certeza que deletar o projeto ${project.name}? Todos os registros relacionados à esse projeto serão também serão deletados.`}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Cancelar
        </Button>
        <Button variant="primary">Deletar</Button>
      </Modal.Footer>
    </Modal>
  );
}
