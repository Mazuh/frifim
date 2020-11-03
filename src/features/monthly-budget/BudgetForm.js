import React from "react";
import get from "lodash.get";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { FlowTypeSelectionFieldset } from "../categories/CategoriesView";
import { currentDatetimeValue } from "../transactions/dates";

export default function BudgetForm({ children, onSubmit, isLoading, isCreating, isUpdating, budget }) {
  const formRef = React.useRef();
  const isUpdateMode = !!(budget && budget.uuid);

  const getSubmitLabel = () => {
    if (isUpdateMode) {
      return isUpdating ? 'Alterando...' : 'Alterar no orçamento';
    } else {
      return isCreating ? 'Adicionando...' : 'Adicionar ao orçamento';
    }
  };

  const idPrefix = isUpdateMode ? budget.uuid : 'form';

  const budgetUUID = budget && budget.uuid;
  React.useEffect(() => {
    if (formRef.current) {
      formRef.current.reset();
      formRef.current.datetime.value = currentDatetimeValue();
    }
  }, [budgetUUID]);

  return (
    <Form ref={formRef} onSubmit={onSubmit}>
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
            <FormControl
              type="number"
              placeholder="Valor planejado (até 2 casas decimais para centavos)."
              name="amount"
              step=".01"
              min={0}
              defaultValue={get(budget, 'amount')}
              required
            />
          </InputGroup>
        </Col>
      </Form.Group>
      <FlowTypeSelectionFieldset
        idPrefix={idPrefix}
        defaultValue={get(budget, 'type')}
      />
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
