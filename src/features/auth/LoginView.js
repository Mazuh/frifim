import React from "react";
import { BsBoxArrowInRight } from "react-icons/bs";
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
import Logo from "../../assets/frifim_logo.svg";
import { clearMessages, login } from "./authDuck";
import { PrivacyPolicy, TermsOfService } from "./legal-articles";
import useRecaptcha from "./useRecaptcha";

export default function LoginView() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { isRecaptchaVerified } = useRecaptcha('login-recaptcha');

  const [isLegalVisible, setLegalVisible] = React.useState(false);

  const auth = useSelector(s => s.auth);
  if (auth.isAuthorized) {
    return <Redirect to="inicio" />;
  }

  const handleChange = () => {
    dispatch(clearMessages());
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    if (!isRecaptchaVerified) {
      return;
    }

    const email = event.target.email.value;
    const password = event.target.password.value;
    dispatch(login(email, password));
  };

  const handleSignupClick = () => {
    history.push('/signup');
  };

  return (
    <Container as="main" className="d-flex align-items-center login-view">
      <Card className='m-auto login-card'>
        <Card.Header as="header" className="text-white bg-dark">
          <Row className="align-items-center">
            <Col>
              <Card.Title as="h1">Frifim</Card.Title>
              <Card.Subtitle>
                Gestão financeira simplificada. Gratuitamente.
              </Card.Subtitle>
              <Card.Subtitle className="mt-2">(Em beta!)</Card.Subtitle>
            </Col>
            <Col as="aside" xs="auto">
              <img src={Logo} alt="Frifim logo" width="100" />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body as={Form} onSubmit={handleLoginSubmit}>
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
            <div id="login-recaptcha" className="d-flex align-items-center justify-content-center w-100 mt-2 mb-2" />
          </Row>
          <Row>
            <Col xs="12">
              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3 d-flex align-items-center justify-content-center"
                disabled={auth.isLoading || !isRecaptchaVerified}
              >
                <BsBoxArrowInRight className="mr-2" />
                <span>{auth.isLoading ? 'Entrando...' : 'Entrar'}</span>
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
                  Ao usar o Frifim, <strong>você está totalmente de acordo</strong> com esses termos acima.
                  Os textos foram uma adaptação de boa fé dos termos de uso do serviço Mobilis.
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
