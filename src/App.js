import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import CategoriesView from "./features/categories/CategoriesView";
import { categoriesActions } from "./features/categories/categoriesDuck";
import MainMenu from "./features/navbar/MainMenu";
import MonthlyBudgetView from "./features/monthlyBudget/MonthlyBudgetView";
import { monthlyBudgetActions } from "./features/monthlyBudget/monthlyBudgetDuck";

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
          <Route path="/categorias"><CategoriesView /></Route>
          <Route path="/orçamento-mensal"><MonthlyBudgetView /></Route>
          <Route path="/"><Home /></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

const Home = () => (
  <h1>Início.</h1>
);
