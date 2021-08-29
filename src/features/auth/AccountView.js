import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { BsPersonFill } from 'react-icons/bs';
import { MainContainer, MainHeader, MainSection } from '../main-pages/main-pages';
import { updateDisplayName } from './authDuck';

export default function AccountView() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [isSaving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState(user.displayName);
  const handleDisplayNameChange = (event) => setDisplayName(event.target.value);
  const handleProfileSubmit = (event) => {
    event.preventDefault();

    setSaving(true);
    dispatch(updateDisplayName(displayName, () => setSaving(false)));
  };

  return (
    <MainContainer>
      <MainHeader title="Conta" hint="Gerencie detalhes da sua conta no Frifim." />
      <MainSection icon={<BsPersonFill />} title="Perfil">
        <Form onSubmit={handleProfileSubmit}>
          <Form.Group as={Row} title={`User: ${user.uid}`} controlId="formUserEmail">
            <Form.Label column sm={2}>
              E-mail:
            </Form.Label>
            <Col sm={10}>
              <Form.Control value={user.email} disabled />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formDisplayName">
            <Form.Label column sm={2}>
              Nome:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                name="name"
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
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </MainSection>
    </MainContainer>
  );
}
