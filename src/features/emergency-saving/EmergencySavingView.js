import Decimal from 'decimal.js';
import get from 'lodash.get';
import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsPuzzle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { ViewportContext } from '../../app/contexts';
import { MainContainer, MainHeader, MainSection } from '../main-pages/main-pages';
import { projectsActions } from '../projects/projectsDuck';
import NumberFormat from 'react-number-format';
import EmergencySimulator from './EmergencySimulator';
import { invalidActionToast, validateProject } from '../../utils/project-utils';
import useBasicRequestData from '../../app/useBasicRequestData';

export default function EmergencySavingView() {
  const dispatch = useDispatch();
  const basicRequestData = useBasicRequestData();
  const [emergencySaving, setEmergencySaving] = React.useState('');

  const selectedProjectUuid = get(basicRequestData, 'project.uuid', '');
  const { isMobile } = React.useContext(ViewportContext);
  const project = useSelector((state) =>
    state.projects.items.find((it) => it.uuid === selectedProjectUuid)
  );
  const isEditing = useSelector((state) =>
    state.projects.updating.includes(get(project, 'uuid', ''))
  );

  const projectEmergencySavingValue = get(project, 'emergencySaving', '');
  React.useEffect(() => {
    setEmergencySaving({ floatValue: parseFloat(projectEmergencySavingValue) });
  }, [projectEmergencySavingValue]);

  const handleSavingChange = (value) => setEmergencySaving(value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValidProject = await validateProject(basicRequestData);
    if (!isValidProject) {
      invalidActionToast(isMobile);
      return;
    }

    const emergencySavingValue = new Decimal(get(emergencySaving, 'floatValue', 0))
      .toFixed(2)
      .valueOf();
    dispatch(projectsActions.update(project.uuid, { emergencySaving: emergencySavingValue }));
  };

  return (
    <MainContainer>
      <MainHeader title="Reserva de emergência" />
      <MainSection icon={<BsPuzzle />} title="Definir no orçamento">
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} title="Valor da quantia a ser reservada.">
            <Form.Label column sm={2}>
              Reserva mensal:
            </Form.Label>
            <Col sm={12} md={5}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>R$</InputGroup.Text>
                </InputGroup.Prepend>
                <NumberFormat
                  name="emergencySaving"
                  placeholder="0,00"
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

      <EmergencySimulator />
    </MainContainer>
  );
}
