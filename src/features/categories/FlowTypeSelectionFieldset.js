import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { EXPENSE_TYPE, INCOME_TYPE } from "./constants";

export default function FlowTypeSelectionFieldset({ idPrefix='form', defaultValue = null }) {
  return (
    <fieldset>
      <Form.Group as={Row}>
        <Form.Label as="legend" column sm={2}>
          Tipo:
        </Form.Label>
        <Col sm={10}>
          <Form.Check
            type="radio"
            name="type"
            label={<>{INCOME_TYPE.label} <INCOME_TYPE.Icon className="text-info" /> </>}
            value={INCOME_TYPE.value}
            id={`${idPrefix}CategoryIncome`}
            defaultChecked={defaultValue === INCOME_TYPE.value}
            required
          />
          <Form.Check
            type="radio"
            name="type"
            label={<>{EXPENSE_TYPE.label} <EXPENSE_TYPE.Icon className="text-danger" /> </>}
            value={EXPENSE_TYPE.value}
            id={`${idPrefix}CategoryExpense`}
            defaultChecked={defaultValue === EXPENSE_TYPE.value}
            required
          />
        </Col>
      </Form.Group>
    </fieldset>
  );
}
