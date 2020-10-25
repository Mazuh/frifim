import "bootstrap/dist/css/bootstrap.min.css";
import "izitoast/dist/css/iziToast.min.css";
import "./App.css";
import React from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BsExclamationTriangle } from "react-icons/bs";
import CategoriesView from "./features/categories/CategoriesView";
import { categoriesActions } from "./features/categories/categoriesDuck";
import MainMenu from "./features/navbar/MainMenu";
import MainFooter from "./features/navbar/MainFooter";
import MonthlyBudgetView from "./features/monthly-budget/MonthlyBudgetView";
import { monthlyBudgetActions } from "./features/monthly-budget/monthlyBudgetDuck";
import Home from "./features/home/Home";
import WeeklyBudgetView from "./features/weekly-budget/WeeklyBudgetView";
import { weeklyBudgetActions } from "./features/weekly-budget/weeklyBudgetDuck";

export default function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(categoriesActions.readAll());
    dispatch(monthlyBudgetActions.readAll());
    dispatch(weeklyBudgetActions.readAll());
  }, [dispatch]);

  return (
    <ErrorGuard>
      <BrowserRouter>
        <MainMenu />
        <Switch>
          <Route exact path="/categorias">
            <CategoriesView />
          </Route>
          <Route exact path="/orçamento-mensal">
            <MonthlyBudgetView />
          </Route>
          <Route exact path="/orçamento-semanal">
            <WeeklyBudgetView />
          </Route>
          <Route exact path="/404">
            <NotFoundView />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Redirect to="/404" />
        </Switch>
        <MainFooter />
      </BrowserRouter>
    </ErrorGuard>
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
