import React from "react";
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { BsArrowLeftRight, BsCalendarFill, BsPieChartFill } from "react-icons/bs";
import LoadingContainer from "../loading/LoadingContainer";
import { INCOME_TYPE, EXPENSE_TYPE } from "../categories/constants";
import useSelectorForMonthlyBudgetStatus, { getMonthlyCalcs } from "../monthly-budget/useSelectorForMonthlyBudgetStatus";
import getTransactionsCalcs from "../transactions/getTransactionsCalcs";

export default function Home() {
  const isLoading = useSelector(state => Object.keys(state).some(slice => state[slice].isLoading));
  const monthlySituation = useSelectorForMonthlyBudgetStatus();
  const transactions = useSelector(state => state.transactions.items);

  if (isLoading) {
    return <LoadingContainer />
  }

  const transactionsCalcs = getTransactionsCalcs(transactions);

  const isCurrentlyHealthy = transactionsCalcs.total.isZero() || transactionsCalcs.total.isPositive();

  const transactionsChartData = {
    labels: [INCOME_TYPE.pluralLabel, EXPENSE_TYPE.pluralLabel],
    datasets: [
      {
        backgroundColor: ['rgba(0, 123, 255, 0.5)', 'rgba(255, 193, 7, 0.5)'],
        hoverBackgroundColor: ['rgba(0, 123, 255, 0.7)', 'rgba(255, 193, 7, 0.7)'],
        data: [transactionsCalcs.totalIncomes, transactionsCalcs.totalExpenses],
      },
    ],
  };

  const monthlyBudgetCalcs = getMonthlyCalcs(monthlySituation);

  const isBudgetHealthy = monthlyBudgetCalcs.total.isZero() || monthlyBudgetCalcs.total.isPositive();

  const budgetChartData = {
    labels: [INCOME_TYPE.pluralLabel, EXPENSE_TYPE.pluralLabel],
    datasets: [
      {
        backgroundColor: ['rgba(0, 123, 255, 0.5)', 'rgba(255, 193, 7, 0.5)'],
        hoverBackgroundColor: ['rgba(0, 123, 255, 0.7)', 'rgba(255, 193, 7, 0.7)'],
        data: [monthlyBudgetCalcs.totalIncomes, monthlyBudgetCalcs.totalExpenses],
      },
    ],
  };

  return (
    <Container as="main">
      <header>
        <h1>
          Página inicial
          <br />
          <small className="text-muted">Resumos do mês</small>
        </h1>
      </header>
      <Row>
        <Col as="section" md={4}>
          <Card>
            <Card.Header className="bg-dark text-light">
              <Card.Title as="h2">
                <BsArrowLeftRight /> Transações
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ul>
                <li className="text-secondary">
                  <strong>{INCOME_TYPE.label}: </strong>
                  <span>R$ {transactionsCalcs.totalIncomes.toFixed(2)} </span>
                  <INCOME_TYPE.Icon className="text-primary" />
                </li>
                <li className="text-secondary">
                  <strong>{EXPENSE_TYPE.label}: </strong>
                  <span>R$ {transactionsCalcs.totalExpenses.toFixed(2)} </span>
                  <EXPENSE_TYPE.Icon className="text-warning" />
                </li>
                <li>
                  <strong>Total: </strong>
                  <span className={isCurrentlyHealthy ? 'text-success' : 'text-danger'}>
                    R$ {transactionsCalcs.total.toFixed(2)}
                  </span>
                </li>
              </ul>
              <div className="mt-3">
                <Pie options={{ maintainAspectRatio: false }} height={300} data={transactionsChartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col as="section" md={4}>
          <Card>
            <Card.Header className="bg-dark text-light">
              <Card.Title as="h2">
                <BsCalendarFill /> Orçamentos
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ul>
                <li className="text-secondary">
                  <strong>{INCOME_TYPE.label}: </strong>
                  <span>R$ {monthlyBudgetCalcs.totalIncomes.toFixed(2)} </span>
                  <INCOME_TYPE.Icon className="text-primary" />
                </li>
                <li className="text-secondary">
                  <strong>{EXPENSE_TYPE.label}: </strong>
                  <span>R$ {monthlyBudgetCalcs.totalExpenses.toFixed(2)} </span>
                  <EXPENSE_TYPE.Icon className="text-warning" />
                </li>
                <li>
                  <strong>Total: </strong>
                  <span className={isBudgetHealthy ? 'text-success' : 'text-danger'}>
                    R$ {monthlyBudgetCalcs.total.toFixed(2)}
                  </span>
                </li>
              </ul>
              <div className="mt-3">
                <Pie options={{ maintainAspectRatio: false }} height={300} data={budgetChartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col as="section" md={4}>
          <Card>
            <Card.Header className="bg-dark text-light">
              <Card.Title as="h2">
                <BsPieChartFill /> Em breve...
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Mais gráficos, como estatisticas de categorias mais
                usadas (tanto linha de orçamento quanto de transações),
                dias do mês com picos de transações (gráfico de linha)
                e quanto de valor ainda pode ser transacionado antes
                alcançar o orçado.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
