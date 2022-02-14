import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsCalculator } from 'react-icons/bs';
import { MainSection } from '../main-pages/main-pages';
import NumberFormat from 'react-number-format';
import Decimal from 'decimal.js';
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
  const { change, objectiveTime, objective, amountAfterObjetiveTime, getValue } =
    useEmergencySimulator(emergencyFields);

  const shouldShowResult =
    !Decimal(getValue('monthlySavingAmount')).isZero() &&
    !Decimal(getValue('monthQuantity')).isZero() &&
    !Decimal(getValue('expenses')).isZero();

  return (
    <MainSection icon={<BsCalculator />} title="Simulação">
      <p>
        Não sabe o que fazer? Experimente o simulador (ainda em fase de testes).
        <br />
        Preencha a simulação e encontre um valor recomendado para sua reserva, baseado na sua
        realidade!
      </p>
      <h3>Parâmetros</h3>
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
                  allowNegative={false}
                />
              </InputGroup>
              <Form.Group>
                <Form.Text className="text-muted">{legend}</Form.Text>
              </Form.Group>
            </Form.Group>
          )
        )}

        <div>
          <h3>Resultado</h3>
          {shouldShowResult ? (
            <>
              <p>
                Você precisa de uma reserva total de{' '}
                <em>
                  <MoneyText value={objective} />
                </em>
                .<br />
                Ao fim de <em>{objectiveTime} meses</em>, você terá pelo menos{' '}
                <em>
                  <MoneyText value={amountAfterObjetiveTime} /> reservados
                </em>{' '}
                para emergência.
              </p>
              <p>
                Gostou? Então <strong>salve a reserva mensal</strong> de{' '}
                <strong>
                  <MoneyText value={getValue('monthlySavingAmount')} />
                </strong>{' '}
                no campo lá no início desta página.
              </p>
            </>
          ) : (
            <span>
              Por favor, informe os valores de <strong>meses para proteger</strong>,{' '}
              <strong>despesas fixas por mês</strong> e <strong>quanto guardará todo mês</strong>
              para obter um resultado.
            </span>
          )}
        </div>
      </Form>
    </MainSection>
  );
};

export default EmergencySimulator;
