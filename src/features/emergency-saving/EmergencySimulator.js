import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsCalculator } from 'react-icons/bs';
import { MainSection } from '../main-pages/main-pages';
import NumberFormat from 'react-number-format';
import useEmergencySimulator from './useEmergencySimulator';

const fields = [
  {
    id: 'monthQuantity',
    title: 'Quantidade de meses necessarios para o fundo de emergência:',
    preprend: 'n°',
    decimalScale: 0,
    legend: (
      <Form.Group>
        <Form.Text className="text-muted">
          Quantidade de meses sugerida padrão é de 3 meses para funcionario publico, 6 para carteira
          assinada (CLT) e 12 meses para os demais (estágio, informal, PJ etc.)
        </Form.Text>
      </Form.Group>
    ),
  },
  {
    id: 'expenses',
    title: 'Despesas:',
    preprend: 'R$',
    decimalScale: 2,
    placeholder: 'Ex: 10, 00',
  },
  {
    id: 'recommendedEmergency',
    title: 'Valor mensal recomendado para guardar no fundo de emergência para atingir o objetivo:',
    preprend: 'R$',
    placeholder: 'o valor recomendado é de 10% de suas despesas mensais',
    decimalScale: 2,
  },
  {
    id: 'previusSavedMoney',
    title: 'Dinheiro guardado:',
    preprend: 'R$',
    placeholder: 'Já possui algum dinheiro guardado?',
    decimalScale: 2,
  },
];

const EmergencySimulator = () => {
  const { change, objectiveTime, objective, getValue } = useEmergencySimulator(fields);

  return (
    <MainSection icon={<BsCalculator />} title="Simulação">
      <Form>
        {fields.map(({ id, title, preprend, decimalScale, legend, placeholder }) => (
          <Form.Group className="mb-3" key={id}>
            <Form.Label>{title}</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>{preprend}</InputGroup.Text>
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
            {legend && legend}
          </Form.Group>
        ))}

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
