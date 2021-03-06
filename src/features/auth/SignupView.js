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
import { clearMessages, signupAndLogin } from "./authDuck";
import { PrivacyPolicy, TermsOfService } from "./legal-articles";

export default function SignupView() {
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

  const handleSignupSubmit = (event) => {
    event.preventDefault();

    const displayName = event.target.displayName.value.trim();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;
    const passwordConfirmation = event.target.passwordConfirmation.value;
    const isInAgreement = event.target.agreement.checked;

    if (!displayName) {
      window.alert('Por favor, digite um nome ou apelido de sua preferência.');
    }

    if (!email) {
      window.alert('Por favor, escolha um e-mail para te identificarmos.');
    }

    if (!isInAgreement) {
      window.alert('Concordar com os Termos de Uso e Política de Privacidade é obrigatório.');
      return;
    }

    if (password !== passwordConfirmation) {
      window.alert('A senha e a confirmação estão diferentes.');
      return;
    }

    dispatch(signupAndLogin(email, password, displayName));
  };

  const handleLoginClick = () => {
    history.push('/login');
  };

  return (
    <Container as="main" className="d-flex align-items-center" style={{ marginTop: '-25px' }}>
      <Card className={`${isMobile ? 'w-100' : 'w-50'} m-auto`}>
        <Card.Body as={Form} onSubmit={handleSignupSubmit}>
          <Card.Title as="h1">Frifim</Card.Title>
          <Card.Subtitle as="h2" className="mb-2 text-muted">
            Criando primeiro acesso...
          </Card.Subtitle>
          {!!auth.errorCode && (
            <Alert variant="danger">
              {auth.errorCode === 'auth/email-already-in-use'
                ? 'E-mail já em uso.'
                : 'Desculpe, houve um erro inesperado.'
              }
            </Alert>
          )}
          {!!auth.infoMessage && (
            <Alert variant="info">
              {auth.infoMessage}
            </Alert>
          )}
          <Form.Group controlId="loginName">
            <Form.Label>Nome ou apelido:</Form.Label>
            <Form.Control
              name="displayName"
              placeholder="Como te chamaremos?"
              onChange={handleChange}
              disabled={auth.isLoading}
              minLength="2"
              maxLength="25"
              required
            />
          </Form.Group>
          <Form.Group controlId="signupEmail">
            <Form.Label>E-mail:</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Digite seu melhor e-mail..."
              onChange={handleChange}
              disabled={auth.isLoading}
              minLength="5"
              maxLength="50"
              required
            />
          </Form.Group>
          <Form.Group controlId="signupPassword">
            <Form.Label>Senha:</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Digite pelo menos 8 caracteres de senha..."
              onChange={handleChange}
              disabled={auth.isLoading}
              minLength="8"
              maxLength="100"
              required
            />
          </Form.Group>
          <Form.Group controlId="signupPasswordConfirmation">
            <Form.Label>Confirme a senha:</Form.Label>
            <Form.Control
              name="passwordConfirmation"
              type="password"
              placeholder="Digite a senha acima novamente..."
              onChange={handleChange}
              disabled={auth.isLoading}
              required
            />
          </Form.Group>
          <Form.Group controlId="signupAgreement">
            <Form.Check
              type="checkbox"
              name="agreement"
              label={(
                <span>
                  Declaro que li, compreendi e concordo com os
                  {' '}
                  <Button variant="link" className="p-0" onClick={() => setLegalVisible(true)}>
                    Termos de Uso
                  </Button>
                  {' '}
                  e
                  {' '}
                  <Button variant="link" className="p-0" onClick={() => setLegalVisible(true)}>
                    Política de Privacidade
                  </Button>
                  {' '}
                  do Frifim.
                </span>
              )}
              onChange={handleChange}
              disabled={auth.isLoading}
              required
            />
          </Form.Group>
          <Row>
            <Col xs="12">
              <Button
                variant="success"
                type="submit"
                className="w-100 mb-3"
                disabled={auth.isLoading}
              >
                {auth.isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </Col>
            <Col xs="12">
              <Button
                variant="link"
                className="w-100"
                onClick={handleLoginClick}
                disabled={auth.isLoading}
              >
                Usar conta já existente
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
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
    </Container>
  );
}
