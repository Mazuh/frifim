import React from 'react';
import Decimal from 'decimal.js';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import NumberFormat from 'react-number-format';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import CategoryIndicator from '../categories/CategoryIndicator';

const renderMoneyMuted = value => (
  <><span className="text-muted">R$</span> {value}</>
);

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
    return <EmptyComponent />;
  }

  const total = items.reduce((acc, budget) => acc.plus(budget.amount), Decimal(0)).toFixed(2);

  return (
    <Table responsive striped bordered hover>
      <thead className="bg-dark text-light">
        <tr>
          <th>Nome</th>
          <th>Quantia</th>
          <th>Categoria</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {items.map((budget) => (
          <React.Fragment key={budget.uuid}>
            <tr title={budget.tooltip ? budget.tooltip : null}>
              <td>{budget.name}</td>
              <td>
                <NumberFormat
                  value={Number(budget.amount)}
                  defaultValue={Number(budget.amount)}
                  displayType="text"
                  fixedDecimalScale
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  renderText={value => (
                    <><span className="text-muted">R$</span> {value}</>
                  )}
                />
              </td>
              {budget.uuid === 'weekly-incomes-sum' || budget.uuid === 'weekly-expenses-sum' ? (
                <td />
              ) : (
                <td>
                  <CategoryIndicator categoryUUID={budget.category} />
                </td>
              )}
              {budget.isReadOnly ? (
                <td />
              ) : (
                <td>
                  <Button
                    onClick={() => onUpdate(budget)}
                    disabled={updating.includes(budget.uuid)}
                    size="sm"
                    className="mb-1 mr-1"
                  >
                    <BsPencilSquare /> Alterar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(budget)}
                    disabled={deleting.includes(budget.uuid)}
                    size="sm"
                    className="mb-1"
                  >
                    <BsTrash /> Apagar
                  </Button>
                </td>
              )}
            </tr>
            {extendedUuid === budget.uuid && (
              <tr>
                <td colSpan={4} className="bg-light">
                  <ExtendedComponent budget={budget} />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
        <tr>
          <td>
            <strong>Total</strong>
          </td>
          <td>
            <strong>
              <NumberFormat
                  value={Number(total)}
                  defaultValue={Number(total)}
                  displayType="text"
                  fixedDecimalScale
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  renderText={renderMoneyMuted}
                />
            </strong>
          </td>
          <td />
          <td />
        </tr>
      </tbody>
    </Table>
  );
}
