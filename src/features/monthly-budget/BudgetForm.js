import React, { useState } from 'react';
import get from 'lodash.get';
import NumberFormat from 'react-number-format';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FlowTypeSelectionFieldset from '../categories/FlowTypeSelectionFieldset';
import CategorySelectorFieldset from '../categories/CategorySelectorFieldset';

export default function BudgetForm({
  children,
  onSubmit,
  isLoading,
  isCreating,
  isUpdating,
  budget,
  onFormInit,
  getSubmitCustomLabel,
}) {
  const [amountCurrency, setAmountCurrency] = useState(get(budget, 'amount'));
  const formRef = React.useRef();
  const isUpdateMode = !!(budget && budget.uuid);

  const getSubmitLabel = () => {
    if (getSubmitCustomLabel) {
      return getSubmitCustomLabel(isUpdateMode, isUpdating, isCreating);
    }

    if (isUpdateMode) {
      return isUpdating ? 'Alterando...' : 'Alterar no orçamento';
    } else {
      return isCreating ? 'Adicionando...' : 'Adicionar ao orçamento';
    }
  };

  const idPrefix = isUpdateMode ? budget.uuid : 'form';

  React.useEffect(() => {
    if (!formRef.current) {
      return;
    }

    formRef.current.reset();

    if (typeof onFormInit === 'function') {
      onFormInit(formRef);
    }
  }, [onFormInit]);

  const handleSubmit = (event) => {
    if (!amountCurrency.value) {
      return;
    }

    event.persist();

    onSubmit({ 
      event,
      amount: amountCurrency.value
    });
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Form.Group as={Row} controlId={`${idPrefix}budgetName`}>
        <Form.Label column sm={2}>
          Nome:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            placeholder="Para intitular uma entrada de orçamento."
            name="name"
            maxLength={50}
            defaultValue={get(budget, 'name')}
            autoComplete="off"
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={`${idPrefix}budgetNumber`} className="mb-2">
        <Form.Label sm={2} column>
          Quantia:
        </Form.Label>
        <Col sm={10}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>R$</InputGroup.Text>
            </InputGroup.Prepend>
            <NumberFormat
              name="amount"
              value={amountCurrency && amountCurrency.floatValue}
              defaultValue={get(budget, 'amount')}
              onValueChange={(values) => setAmountCurrency(values)}
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
      <FlowTypeSelectionFieldset idPrefix={idPrefix} defaultValue={get(budget, 'type')} />
      <CategorySelectorFieldset idPrefix={idPrefix} defaultValue={get(budget, 'category')} />
      {children}
      <Form.Group as={Row}>
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit" variant={isUpdateMode ? 'warning' : 'success'} disabled={isLoading}>
            {getSubmitLabel()}
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
}
