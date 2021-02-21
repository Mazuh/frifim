import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ViewportContext } from "../../app/contexts";
import { clearMessages, login } from "./authDuck";
import { PrivacyPolicy, TermsOfService } from "./legal-articles";

export default function LoginView() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLegalVisible, setLegalVisible] = React.useState(false);

  const { isMobile } = React.useContext(ViewportContext);

  const auth = useSelector(s => s.auth);
  if (auth.isAuthorized) {
    return <Redirect to="inicio" />;
  }

  const handleChange = () => {
    dispatch(clearMessages());
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    dispatch(login(email, password));
  };

  const handleSignupClick = () => {
    history.push('/signup');
  };

  return (
    <Container as="main" className="d-flex align-items-center">
      <Card className={`${isMobile ? 'w-100' : 'w-50'} m-auto`}>
        <Card.Body as={Form} onSubmit={handleLoginSubmit}>
          <Card.Title as="h1">Frifim</Card.Title>
          <Card.Subtitle as="h2" className="mb-2 text-muted">
            Entre agora!
          </Card.Subtitle>
          <Card.Text>
            Gestão financeira simplificada. Gratuitamente.
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
                onClick={handleSignupClick}
                disabled={auth.isLoading}
              >
                Primeira vez aqui? Cadastre-se!
              </Button>
            </Col>
            <Col xs="12">
              <Button
                variant="link"
                className="w-100"
                onClick={() => setLegalVisible(true)}
              >
                Termos de Uso e Política de Privacidade
              </Button>
              <Modal show={isLegalVisible} onHide={() => setLegalVisible(false)}>
                <Modal.Header closeButton>
                  Termos de Uso e Política de Privacidade.
                </Modal.Header>
                <Modal.Body>
                  <TermsOfService />
                  <PrivacyPolicy />
                </Modal.Body>
                <Modal.Footer>
                  Ao usar o Frifim, você está totalmente de acordo com esses termos acima.
                  O texto delas foi uma adaptação de boa fé dos termos de uso do serviço Mobilis.
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
