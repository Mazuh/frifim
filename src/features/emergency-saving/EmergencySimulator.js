import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsCalculator } from 'react-icons/bs';
import { MainSection } from '../main-pages/main-pages';
import NumberFormat from 'react-number-format';
import useEmergencySimulator from './useEmergencySimulator';
import { emergencyFields } from './constants';

const MoneyText = ({ value }) => (
  <NumberFormat
    defaultValue={value}
    value={value}
    fixedDecimalScale
    decimalSeparator={','}
    thousandSeparator={'.'}
    decimalScale={2}
    displayType="text"
    prefix="R$ "
  />
);

const EmergencySimulator = () => {
  const { change, objectiveTime, objective, getValue } = useEmergencySimulator(emergencyFields);

  return (
    <MainSection icon={<BsCalculator />} title="Simulação">
      <p>
        Não sabe o que fazer?
        <br />
        Preencha a simulação e encontre um valor recomendado para sua reserva, baseado na sua
        realidade!
      </p>
      <Form>
        {emergencyFields.map(
          ({ id, label, prepend, prependStyle, decimalScale, legend, placeholder }) => (
            <Form.Group className="mb-3 col-12 col-md-5" key={id}>
              <Form.Label htmlFor={id}>{label}</Form.Label>
              <InputGroup style={prependStyle}>
                <InputGroup.Prepend>
                  <InputGroup.Text>{prepend}</InputGroup.Text>
                </InputGroup.Prepend>
                <NumberFormat
                  id={id}
                  autoComplete="off"
                  placeholder={placeholder}
                  inputMode="decimal"
                  value={getValue(id)}
                  onValueChange={change(id)}
                  displayType={'input'}
                  fixedDecimalScale
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={decimalScale}
                  className="form-control"
                />
              </InputGroup>
              <Form.Group>
                <Form.Text className="text-muted">{legend}</Form.Text>
              </Form.Group>
            </Form.Group>
          )
        )}

        <Form.Group>
          <h3>Resultado</h3>
          <p>
            Ao fim de <strong>{objectiveTime} meses</strong>, você terá pelo menos{' '}
            <strong>{<MoneyText value={objective} />} reservados</strong> para emergência.
          </p>
          <p>
            Caso isso te agrade, <strong>salve</strong> o valor da sua reserva como{' '}
            <strong>
              <MoneyText value={getValue('recommendedEmergency')} />
            </strong>{' '}
            no campo lá no início desta página.
          </p>
        </Form.Group>
      </Form>
    </MainSection>
  );
};

export default EmergencySimulator;
