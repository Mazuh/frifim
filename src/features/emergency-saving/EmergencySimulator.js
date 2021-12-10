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
      <Form>
        {emergencyFields.map(
          ({ id, label, prepend, prependStyle, decimalScale, legend, placeholder }) => (
            <Form.Group className="mb-3" key={id}>
              <Form.Label>{label}</Form.Label>
              <InputGroup style={prependStyle}>
                <InputGroup.Prepend>
                  <InputGroup.Text>{prepend}</InputGroup.Text>
                </InputGroup.Prepend>
                <NumberFormat
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
            Isso depende de todos os parâmetros da simulação, ou seja, irá te proteger por{' '}
            {objectiveTime} meses de despesas, mas você já tem{' '}
            {<MoneyText value={getValue('previouslySavedAmount')} />} de início e irá guardar{' '}
            {<MoneyText value={getValue('recommendedEmergency')} />}todo mês.
          </p>
        </Form.Group>
      </Form>
    </MainSection>
  );
};

export default EmergencySimulator;
