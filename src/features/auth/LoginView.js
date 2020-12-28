import React from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ViewportContext } from "../../app/contexts";
import { clearMessages, login } from "./authDuck";

export default function Login() {
  const dispatch = useDispatch();

  const { isMobile } = React.useContext(ViewportContext);

  const auth = useSelector(s => s.auth);
  if (auth.isAuthorized) {
    return <Redirect to="inicio" />;
  }

  const handleChange = () => {
    dispatch(clearMessages());
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    dispatch(login(email, password));
  };

  const handleCreateClick = () => {
    window.alert('Estamos em fase alfa de testes, por ora apenas usuários convidados têm acesso.');
  };

  return (
    <Container as="main">
      <Card className={`${isMobile ? 'w-100' : 'w-50'} m-auto`}>
        <Card.Body as={Form} onSubmit={handleSubmit}>
          <Card.Title as="h1">Moneycog</Card.Title>
          <Card.Subtitle as="h2" className="mb-2 text-muted">
            Entre de graça!
          </Card.Subtitle>
          <Card.Text>
            Gestão doméstica de finanças e gastos, para leigos.
          </Card.Text>
          {!!auth.errorCode && (
            <Alert variant="danger">
              Desculpe, houve um erro com seu e-mail ou senha.
            </Alert>
          )}
          {!!auth.infoMessage && (
            <Alert variant="info">
              {auth.infoMessage}
            </Alert>
          )}
          <Form.Group controlId="loginEmail">
            <Form.Label>E-mail:</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Digite o e-mail cadastrado..."
              onChange={handleChange}
              disabled={auth.isLoading}
              required
            />
          </Form.Group>
          {!auth.isLoading && (
            <Form.Group controlId="loginPassword">
              <Form.Label>Senha:</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Digite a senha..."
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}
          <Row>
            <Col xs="12">
              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                disabled={auth.isLoading}
              >
                {auth.isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Col>
            <Col xs="12">
              <Button
                variant="link"
                className="w-100"
                onClick={handleCreateClick}
                disabled={auth.isLoading}
              >
                Primeira vez aqui?
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
