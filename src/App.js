import "bootstrap/dist/css/bootstrap.min.css";
import "izitoast/dist/css/iziToast.min.css";
import "./App.css";
import React from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BsExclamationTriangle } from "react-icons/bs";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import useIzitoastForResource from "./features/izitoast-for-resources/useIzitoastForResource";
import CategoriesView from "./features/categories/CategoriesView";
import { categoriesActions } from "./features/categories/categoriesDuck";
import MainMenu from "./features/navbar/MainMenu";
import MainFooter from "./features/navbar/MainFooter";
import MonthlyBudgetView from "./features/monthly-budget/MonthlyBudgetView";
import { monthlyBudgetActions } from "./features/monthly-budget/monthlyBudgetDuck";
import Home from "./features/home/Home";
import WeeklyBudgetView from "./features/weekly-budget/WeeklyBudgetView";
import { weeklyBudgetActions } from "./features/weekly-budget/weeklyBudgetDuck";
import TransactionsView from "./features/transactions/TransactionsView";
import { transactionsActions } from "./features/transactions/transactionsDuck";
import LoginView from "./features/auth/LoginView";
import GlobalContextProvider from "./app/contexts";

export default function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(categoriesActions.readAll());
    dispatch(monthlyBudgetActions.readAll());
    dispatch(weeklyBudgetActions.readAll());
    dispatch(transactionsActions.readAll());
  }, [dispatch]);

  return (
    <ErrorGuard>
      <GlobalContextProvider>
        <BrowserRouter>
          <MainMenu />
          <Page>
            <Switch>
              <ProtectedRoute exact path="/categorias">
                <CategoriesView />
              </ProtectedRoute>
              <ProtectedRoute exact path="/orçamento-mensal">
                <MonthlyBudgetView />
              </ProtectedRoute>
              <ProtectedRoute exact path="/orçamento-semanal">
                <WeeklyBudgetView />
              </ProtectedRoute>
              <ProtectedRoute exact path="/transacoes">
                <TransactionsView />
              </ProtectedRoute>
              <ProtectedRoute exact path="/inicio">
                <Home />
              </ProtectedRoute>
              <Route exact path="/login">
                <LoginView />
              </Route>
              <Route exact path="/">
                <LoginView />
              </Route>
              <Route exact path="/404">
                <NotFoundView />
              </Route>
              <Redirect to="/404" />
            </Switch>
          </Page>
          <MainFooter />
        </BrowserRouter>
      </GlobalContextProvider>
    </ErrorGuard>
  );
}

const useAllResourceToasts = () => {
  useIzitoastForResource('transactions');
  useIzitoastForResource('monthlyBudget');
  useIzitoastForResource('weeklyBudget');
  useIzitoastForResource('categories');
};

function Page(props) {
  useAllResourceToasts();

  return (
    <div className="mt-4 pt-5" {...props} />
  );
}

class ErrorGuard extends React.PureComponent {
  state = {
    isError: false,
  }

  componentDidCatch() {
    this.setState({ isError: true });
  }

  render() {
    if (this.state.isError) {
      return <UnknownCriticalErrorView />
    }

    return this.props.children;
  }
}

function NotFoundView() {
  return (
    <main className="container">
      <header>
        <h1><BsExclamationTriangle /> Ops...<br /><small>Página não encontrada.</small></h1>
      </header>
      <p>
        Navegue por outras páginas usando o menu principal.
      </p>
    </main>
  );
}

function UnknownCriticalErrorView() {
  return (
    <main className="container mt-2">
      <header>
        <h1>Eita!<br /><small>Erro interno desconhecido.</small></h1>
      </header>
      <p>
        Volte à <a href="/">página inicial</a> e reporte esse erro ao time de desenvolvimento.
      </p>
    </main>
  );
}
