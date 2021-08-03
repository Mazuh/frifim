import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BsPersonPlus } from 'react-icons/bs';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { clearMessages, signupAndLogin } from './authDuck';
import { PrivacyPolicy, TermsOfService } from './legal-articles';
import useRecaptcha from './useRecaptcha';

export default function SignupView() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [displayName, setDisplayName] = useState('');
  const handleDisplayNameChange = (event) => setDisplayName(event.target.value);

  const [email, setEmail] = useState('');
  const handleEmailChange = (event) => setEmail(event.target.value);

  const [password, setPassword] = useState('');
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const handlePasswordConfirmationChange = (event) => setPasswordConfirmation(event.target.value);

  const [isInAgreement, setIsInAgreement] = useState(false);
  const handleAgreementChange = (event) => setIsInAgreement(event.target.checked);

  const { isRecaptchaVerified } = useRecaptcha('signup-recaptcha');

  const [isLegalVisible, setLegalVisible] = useState(false);

  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch, displayName, email, password, passwordConfirmation, isInAgreement]);

  const auth = useSelector((s) => s.auth);
  if (auth.isAuthorized) {
    return <Redirect to="inicio" />;
  }

  const handleSignupSubmit = (event) => {
    event.preventDefault();

    if (!isRecaptchaVerified) {
      return;
    }

    if (!displayName.trim()) {
      window.alert('Por favor, digite um nome ou apelido de sua preferência.');
    }

    if (!email.trim()) {
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
    <Container as="main" className="d-flex align-items-center signup-view">
      <Card className="m-auto signup-card">
        <Card.Header className="text-white bg-dark">
          <Card.Title as="h1">Frifim</Card.Title>
          <Card.Subtitle className="mb-2">Criando primeiro acesso...</Card.Subtitle>
        </Card.Header>
        <Card.Body as={Form} onSubmit={handleSignupSubmit}>
          {!!auth.errorCode && (
            <Alert variant="danger">
              {auth.errorCode === 'auth/email-already-in-use'
                ? 'E-mail já em uso.'
                : 'Desculpe, houve um erro inesperado.'}
            </Alert>
          )}
          {!!auth.infoMessage && <Alert variant="info">{auth.infoMessage}</Alert>}
          <Form.Group controlId="loginName">
            <Form.Label>Nome ou apelido:</Form.Label>
            <Form.Control
              name="displayName"
              value={displayName}
              onChange={handleDisplayNameChange}
              placeholder="Como te chamaremos?"
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
              value={email}
              onChange={handleEmailChange}
              type="email"
              placeholder="Digite seu melhor e-mail..."
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
              value={password}
              onChange={handlePasswordChange}
              type="password"
              placeholder="Digite pelo menos 8 caracteres de senha..."
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
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
              type="password"
              placeholder="Digite a senha acima novamente..."
              disabled={auth.isLoading}
              required
            />
          </Form.Group>
          <Form.Group controlId="signupAgreement">
            <Form.Check
              type="checkbox"
              name="agreement"
              checked={isInAgreement}
              onChange={handleAgreementChange}
              aria-label="Declaro que li, compreendi e concordo com os Termos de Uso e Política de Privacidade do Frifim."
              label={
                <span>
                  Declaro que li, compreendi e concordo com os{' '}
                  <Button variant="link" className="p-0" onClick={() => setLegalVisible(true)}>
                    Termos de Uso
                  </Button>{' '}
                  e{' '}
                  <Button variant="link" className="p-0" onClick={() => setLegalVisible(true)}>
                    Política de Privacidade
                  </Button>{' '}
                  do Frifim.
                </span>
              }
              disabled={auth.isLoading}
              required
            />
          </Form.Group>
          <Row>
            <div
              id="signup-recaptcha"
              className="d-flex align-items-center justify-content-center w-100 mt-2 mb-2"
            />
          </Row>
          <Row>
            <Col xs="12">
              <Button
                variant="success"
                type="submit"
                className="w-100 mb-3 d-flex align-items-center justify-content-center"
                disabled={auth.isLoading || !isRecaptchaVerified}
              >
                <BsPersonPlus className="mr-2" />
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
        <Modal.Header closeButton>Termos de Uso e Política de Privacidade.</Modal.Header>
        <Modal.Body>
          <TermsOfService />
          <PrivacyPolicy />
        </Modal.Body>
        <Modal.Footer>
          Ao usar o Frifim, <strong>você está totalmente de acordo</strong> com esses termos acima.
          Os textos foram uma adaptação de boa fé dos termos de uso do serviço Mobilis.
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
