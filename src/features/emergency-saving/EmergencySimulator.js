import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsCalculator } from 'react-icons/bs';
import { MainSection } from '../main-pages/main-pages';
import NumberFormat from 'react-number-format';
import useEmergencySimulator from './useEmergencySimulator';
import { emergencyFields } from './constants';

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
                  data-testid={id}
                  name={id}
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
          <h6>
            Valor total do fundo de emergência estimado para atingir o objetivo{' '}
            {
              <NumberFormat
                data-testid="objectiveId"
                id="objectiveId"
                defaultValue={objective}
                value={objective}
                fixedDecimalScale
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                displayType="text"
              />
            }
          </h6>
          {objectiveTime > 0 && (
            <div data-testid="objectiveTimeId">
              <h6>
                Tempo para atingir o objetivo {objectiveTime}
                {objectiveTime > 1 ? ' meses' : ' mês'}
              </h6>
            </div>
          )}
        </Form.Group>
      </Form>
    </MainSection>
  );
};

export default EmergencySimulator;
