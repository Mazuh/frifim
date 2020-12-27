import React from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ViewportContext } from "../../app/contexts";
import { login } from "./authDuck";

export default function Login() {
  const dispatch = useDispatch();

  const { isMobile } = React.useContext(ViewportContext);

  const auth = useSelector(s => s.auth);
  if (auth.isAuthorized) {
    return <Redirect to="inicio" />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login());
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
          <Form.Group controlId="loginEmail">
            <Form.Label>E-mail:</Form.Label>
            <Form.Control name="email" type="email" placeholder="Digite o e-mail cadastrado..." required />
          </Form.Group>
          <Form.Group controlId="loginPassword">
            <Form.Label>Senha:</Form.Label>
            <Form.Control name="password" type="password" placeholder="Digite a senha..." required />
          </Form.Group>
          <Row>
            <Col xs="12">
              <Button variant="primary" type="submit" className="w-100" disabled={auth.isLoading}>
                {auth.isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Col>
            <Col xs="12">
              <Button variant="link" className="w-100" disabled={auth.isLoading}>
                Primeira vez aqui?
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
