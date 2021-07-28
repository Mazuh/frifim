import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';

export function MainContainer({ children }) {
  return <Container as="main">{children}</Container>;
}

export function MainHeader({ title, hint }) {
  const [isHelpVisible, setHelpVisible] = React.useState(false);

  return (
    <Row as="header" className="align-items-center mb-2">
      <Col xs="12" sm="10">
        <h1>{title}</h1>
      </Col>
      {!!hint && (
        <Col xs="12" sm="auto">
          <Button onClick={() => setHelpVisible(true)} size="sm" variant="outline-secondary">
            O que é isso?
          </Button>
          <Modal show={isHelpVisible} onHide={() => setHelpVisible(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{hint}</Modal.Body>
          </Modal>
        </Col>
      )}
    </Row>
  );
}

export function MainSection({ icon, title, children }) {
  return (
    <Card as="section" className="mb-3">
      <Card.Header className="bg-dark text-light">
        <Card.Title as="h2">
          {icon} {title}
        </Card.Title>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}
