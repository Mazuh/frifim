import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { BsFolder, BsFolderPlus } from 'react-icons/bs';
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
  const openCreation = () => setCreationVisible(true);
  const closeCreation = () => setCreationVisible(false);

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
          <Dropdown.Item
            key={listingProject.uuid}
            eventKey={`project-selector_${listingProject.uuid}`}
          >
            {listingProject.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <CreationModal
        isVisible={isCreationVisible}
        isBlocked={projectsState.isLoading}
        close={closeCreation}
      />
    </>
  );
}

function CreationModal({ isVisible, isBlocked, close }) {
  const dispatch = useDispatch();
  const { setProject } = React.useContext(ProjectContext);

  const createAndSelectProject = (project) => (dispatch) => {
    new Promise((resolve) => projectsActions.create(project, resolve)(dispatch)).then(
      (createdProject) => {
        if (!createdProject) return;
        dispatch(setLastSelectedProjectUuid(createdProject.uuid));
        setProject(createdProject);
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = event.target.name.value.trim();
    if (!name) {
      return;
    }

    dispatch(
      createAndSelectProject({ name, createdAt: new Date().toISOString(), guestsEmails: [] })
    );
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
