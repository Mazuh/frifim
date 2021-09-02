import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { BsLockFill, BsPersonFill } from 'react-icons/bs';
import { updatePassword } from '../../app/firebase-configs';
import { MainContainer, MainHeader, MainSection } from '../main-pages/main-pages';
import { updateDisplayName } from './authDuck';
import { useEmailVerification } from './EmailVerification';

export default function AccountView() {
  const dispatch = useDispatch();
  const { emailVerified } = useEmailVerification();
  const user = useSelector((state) => state.auth.user);
  const [isSaving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState(user.displayName);
  const handleDisplayNameChange = (event) => setDisplayName(event.target.value);
  const handleProfileSubmit = (event) => {
    event.preventDefault();

    setSaving(true);
    dispatch(updateDisplayName(displayName, () => setSaving(false)));
  };

  const [password, setPassword] = useState('');
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);
  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      window.alert('Senha e sua confirmação estão diferentes.');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    setSaving(true);
    updatePassword(password)
      .then()
      .then(() => {
        window.alert('Senha alterada com sucesso.');
      })
      .catch((error) => {
        console.error('Error on updating password', error);
        window.alert(
          'Erro. Provavelmente sua sessão está muito antiga. Faça login novamente antes de tentar outra vez.'
        );
      })
      .finally(() => {
        setSaving(false);
        setPassword('');
        setConfirmPassword('');
      });
  };

  return (
    <MainContainer>
      <MainHeader title="Conta" hint="Gerencie detalhes da sua conta no Frifim." />
      <MainSection icon={<BsPersonFill />} title="Perfil">
        <Form onSubmit={handleProfileSubmit}>
          <Form.Group as={Row} title={`UID: ${user.uid}`} controlId="formUserEmail">
            <Form.Label column sm={2}>
              E-mail:
            </Form.Label>
            <Col sm={10}>
              <Form.Control value={user.email} disabled />
              {emailVerified && <small className="text-success">Conta confirmada.</small>}
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formDisplayName">
            <Form.Label column sm={2}>
              Nome:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                value={displayName}
                onChange={handleDisplayNameChange}
                placeholder="Como prefere se chamar?"
                minLength={3}
                maxLength={20}
                autoComplete="off"
                disabled={isSaving}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit" variant="outline-success" disabled={isSaving}>
                {isSaving ? 'Salvando perfil...' : 'Salvar perfil'}
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </MainSection>
      <MainSection icon={<BsLockFill />} title="Senha">
        <Form onSubmit={handlePasswordSubmit}>
          <Form.Group as={Row} controlId="formPassword">
            <Form.Label column sm={2}>
              Nova senha:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="password"
                value={password}
                onChange={handlePasswordChange}
                minLength="8"
                maxLength="100"
                autoComplete="off"
                disabled={isSaving}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formPassword2">
            <Form.Label column sm={2}>
              Confirme a nova senha:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                autoComplete="off"
                disabled={isSaving}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit" variant="outline-danger" disabled={isSaving}>
                {isSaving ? 'Salvando senha...' : 'Mudar senha'}
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </MainSection>
    </MainContainer>
  );
}
