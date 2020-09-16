import React from "react";
import Decimal from "decimal.js";
import get from "lodash.get";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { useSelector, useDispatch } from "react-redux";
import { FlowTypeSelectionFieldset } from "../categories/CategoriesView";
import LoadingContainer from "../loading/LoadingContainer";
import { EXPENSE_TYPE, INCOME_TYPE, FLOW_TYPES } from "../categories/constants";
import { weeklyBudgetActions } from "./weeklyBudgetDuck";
import useIzitoastForResource from "../izitoast-for-resources/useIzitoastForResource";
import { BudgetTable } from "../monthly-budget/MonthlyBudgetView";
import { WEEK_DAYS } from "./constants";

export default function WeeklyBudgetView() {
  const dispatch = useDispatch();
  const weeklyBudgetState = useSelector(state => state.weeklyBudget);
  const [enabledUpdateUuid, setEnabledUpdateUuid] = React.useState(null);

  useIzitoastForResource('weeklyBudget');

  if (weeklyBudgetState.isReadingAll) {
    return <LoadingContainer />
  }

  const handleUpdate = (budget) => {
    setEnabledUpdateUuid(enabledUpdateUuid === budget.uuid ? null : budget.uuid);
  };

  const handleDelete = (budget) => {
    if (window.confirm(`Deletar do orçamento "${budget.name}"?`)) {
      dispatch(weeklyBudgetActions.delete(budget.uuid));
    }
  }

  return (
    <Container as="main">
      <header>
        <h1>Orçamento semanal</h1>
      </header>
      <section>
        <h2>Criar</h2>
        <p>TODO</p>
      </section>
      {WEEK_DAYS.map(dayEntity => (
        <section key={dayEntity.value}>
          <h2>{dayEntity.label}</h2>
          {FLOW_TYPES.map(flowType => (
            <section key={flowType.value}>
              <h3>{flowType.pluralLabel}</h3>
              <BudgetTable
                items={weeklyBudgetState.items.filter(isThisBudgetSectionFn(dayEntity, flowType))}
                onDelete={(handleDelete)}
                deleting={weeklyBudgetState.deleting}
                onUpdate={handleUpdate}
                updating={weeklyBudgetState.updating}
                extendedUuid={enabledUpdateUuid}
                // ExtendedComponent={MonthlyBudgetTableRowExtension}
                EmptyComponent={() => <p>Sem planejamentos aqui.</p>}
              />
            </section>
          ))}
        </section>
      ))}
    </Container>
  );
}

const isThisBudgetSectionFn = (
  (dayEntity, flowType) =>
    budget =>
      budget.day === dayEntity.value && budget.type === flowType.value
);
