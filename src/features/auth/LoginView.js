import React, { useReducer } from "react";
import { BsBoxArrowInRight } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
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
import { clearMessages, login, signInByGoogle } from "./authDuck";
import { PrivacyPolicy, TermsOfService } from "./legal-articles";
import useRecaptcha from "./useRecaptcha";

export default function LoginView() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useReducer((data, newData) => ({ ...data, ...newData}), {})

  const saveInputData = (input) => (event) => {
    dispatch(clearMessages());
    setFormData({
    [input]: event.currentTarget.value
  })}

  const history = useHistory();

  const { isRecaptchaVerified } = useRecaptcha('login-recaptcha');

  const [isLegalVisible, setLegalVisible] = React.useState(false);

  const auth = useSelector(s => s.auth);
  if (auth.isAuthorized) {
    return <Redirect to="inicio" />;
  }


  const handleLoginSubmit = (event) => {
    event.preventDefault();

    if (!isRecaptchaVerified) {
      return;
    }

    const { email, password } = formData;

    dispatch(login(email, password));
  };

  const handleGoogleClick = () => {
    dispatch(signInByGoogle({ signInWithRedirect: false }));
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
              {auth.errorCode === 'auth/operation-not-allowed'
                ? 'Não permitido. Entre em contato com o suporte.'
                : 'Desculpe, houve um erro com seu e-mail ou senha.'}
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
              data-testid="email"
              name="email"
              type="email"
              onChange={saveInputData('email')}
              placeholder="Digite o e-mail cadastrado..."
              disabled={auth.isLoading}
              required
            />
          </Form.Group>
          {!auth.isLoading && (
            <Form.Group controlId="loginPassword">
              <Form.Label>Senha:</Form.Label>
              <Form.Control
                data-testid="password"
                name="password"
                type="password"
                onChange={saveInputData('password')}
                placeholder="Digite a senha..."
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
                data-testid="submit-button"
                className="w-100 mb-3 d-flex align-items-center justify-content-center"
                disabled={auth.isLoading || !isRecaptchaVerified}
              >
                <BsBoxArrowInRight className="mr-2" />
                <span>{auth.isLoading ? 'Entrando...' : 'Entrar usando e-mail'}</span>
              </Button>
            </Col>
            <Col xs="12">
              <Button
                variant="outline-primary"
                type="button"
                className="w-100 mb-3 d-flex align-items-center justify-content-center"
                disabled={auth.isLoading}
                onClick={handleGoogleClick}
              >
                <FcGoogle className="mr-2" />
                <span>Continuar via Google</span>
              </Button>
            </Col>
            <Col xs="12">
              <Button
                variant="link"
                className="w-100"
                onClick={handleSignupClick}
                disabled={auth.isLoading}
              >
                Cadastro usando e-mail
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
