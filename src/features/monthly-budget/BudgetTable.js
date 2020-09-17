import React from "react";
import Decimal from "decimal.js";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

export default function BudgetTable({
  items,
  onDelete,
  deleting,
  onUpdate,
  updating,
  extendedUuid,
  ExtendedComponent,
  EmptyComponent = null,
}) {
  if (items.length === 0 && typeof EmptyComponent === 'function') {
    return <EmptyComponent />
  }

  const total = items.reduce((acc, budget) => acc.plus(budget.amount), Decimal(0)).toFixed(2);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Quantia</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {items.map((budget) => (
          <React.Fragment key={budget.uuid}>
            <tr>
              <td>{budget.name}</td>
              <td>R$ {budget.amount}</td>
              <td>
                <Button
                  onClick={() => onUpdate(budget)}
                  disabled={updating.includes(budget.uuid)}
                  size="sm"
                  className="mb-1 mr-1"
                >
                  Alterar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(budget)}
                  disabled={deleting.includes(budget.uuid)}
                  size="sm"
                  className="mb-1"
                >
                  Apagar
                </Button>
              </td>
            </tr>
            {extendedUuid === budget.uuid && (
              <tr>
                <td colSpan={3} className="bg-light">
                  <ExtendedComponent budget={budget} />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
        <tr>
          <td><strong>Total</strong></td>
          <td><strong>R$ {total}</strong></td>
          <td>{' '}</td>
        </tr>
      </tbody>
    </Table>
  );
}

