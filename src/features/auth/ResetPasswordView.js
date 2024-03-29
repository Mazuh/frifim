import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from './authDuck';

export default function ResetPasswordView() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const isLoading = useSelector((state) => state.auth.isLoading);

  const sendResetEmail = (event) => {
    event.preventDefault();

    dispatch(resetPassword(email));
  };

  const handleEmailChange = (event) => setEmail(event.target.value);

  const handleLoginClick = () => {
    history.push('/login');
  };

  return (
    <Container as="main" className="d-flex align-items-center signup-view">
      <Card className="m-auto signup-card">
        <Card.Header className="text-white bg-dark">
          <Card.Title as="h1">Frifim</Card.Title>
          <Card.Subtitle className="mb-2">Redefinindo sua senha...</Card.Subtitle>
        </Card.Header>
        <Card.Body as={Form} onSubmit={sendResetEmail}>
          <Form.Group controlId="signupEmail">
            <Form.Label>Por favor, nos informe o e-mail cadastrado:</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Digite seu melhor e-mail..."
              onChange={handleEmailChange}
              minLength="5"
              maxLength="50"
              required
            />
          </Form.Group>
          <Row>
            <Col xs="12">
              <Button
                variant="success"
                type="submit"
                className="w-100 mt-3 d-flex align-items-center justify-content-center"
                disabled={isLoading}
              >
                Enviar
              </Button>
            </Col>
            <Col xs="12">
              <Button
                variant="link"
                className="w-100"
                onClick={handleLoginClick}
                disabled={isLoading}
              >
                Voltar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
