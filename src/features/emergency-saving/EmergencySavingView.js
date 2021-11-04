import Decimal from 'decimal.js';
import get from 'lodash.get';
import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsGear } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { ProjectContext } from '../../app/contexts';
import { MainContainer, MainHeader, MainSection } from '../main-pages/main-pages';
import { projectsActions } from '../projects/projectsDuck';
import NumberFormat from 'react-number-format';

export default function EmergencySavingView() {
  const dispatch = useDispatch();
  const [emergencySaving, setEmergencySaving] = React.useState('');

  const {
    project: { uuid: selectedProjectUuid },
  } = React.useContext(ProjectContext);
  const project = useSelector((state) =>
    state.projects.items.find((it) => it.uuid === selectedProjectUuid)
  );
  const isEditing = useSelector((state) => state.projects.updating.includes(project.uuid));

  const projectEmergencySavingValue = get(project, 'emergencySaving', '');
  React.useEffect(() => {
    setEmergencySaving({ floatValue: parseFloat(projectEmergencySavingValue) });
  }, [projectEmergencySavingValue]);

  const handleSavingChange = (value) => setEmergencySaving(value);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!emergencySaving) {
      return;
    }

    const emergencySavingValue = new Decimal(emergencySaving.floatValue).toFixed(2).valueOf();
    dispatch(projectsActions.update(project.uuid, { emergencySaving: emergencySavingValue }));
  };

  return (
    <MainContainer>
      <MainHeader title="Reserva de emergência" />
      <MainSection icon={<BsGear />} title="Configuração">
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} title="Valor da quantia a ser reservada.">
            <Form.Label column sm={2}>
              Valor da reserva:
            </Form.Label>
            <Col sm={10}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>R$</InputGroup.Text>
                </InputGroup.Prepend>
                <NumberFormat
                  name="emergencySaving"
                  placeholder="Digite o valor."
                  autoComplete="off"
                  inputMode="decimal"
                  value={emergencySaving.floatValue}
                  onValueChange={handleSavingChange}
                  displayType={'input'}
                  fixedDecimalScale
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  className="form-control"
                  required
                />
              </InputGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button
                type="submit"
                variant="outline-success"
                title="Salvar reserva de emergência."
                disabled={isEditing}
              >
                {isEditing ? 'Salvando...' : 'Salvar'}
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </MainSection>
    </MainContainer>
  );
}
