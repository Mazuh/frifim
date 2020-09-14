import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import CategoriesView from "./features/categories/CategoriesView";
import { categoriesActions } from "./features/categories/categoriesDuck";
import MainMenu from "./features/navbar/MainMenu";
import MonthlyBudgetView from "./features/monthly-budget/MonthlyBudgetView";
import { monthlyBudgetActions } from "./features/monthly-budget/monthlyBudgetDuck";
import Home from "./features/home/Home";

export default function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(categoriesActions.readAll());
    dispatch(monthlyBudgetActions.readAll());
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <MainMenu />
        <Switch>
          <Route exact path="/categorias">
            <CategoriesView />
          </Route>
          <Route exact path="/orçamento-mensal">
            <MonthlyBudgetView />
          </Route>
          <Route exact path="/404">
            <NotFoundView />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Redirect to="/404" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

function NotFoundView() {
  return (
    <main className="container">
      <header>
        <h1>Ops...<br /><small>Página não encontrada.</small></h1>
      </header>
      <p>
        Você pode voltar à página inicial ou usar algum botão do menu principal.
      </p>
    </main>
  );
}
