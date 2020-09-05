import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useDispatch } from "react-redux";
import CategoriesView from "./features/categories/CategoriesView";
import { categoriesActions } from "./features/categories/categoriesDuck";

export default function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(categoriesActions.readAll());
  }, [dispatch]);

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">Moneycog</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">Início</Nav.Link>
          <Nav.Link href="#">Plano mensal</Nav.Link>
          <Nav.Link href="#">Plano semanal</Nav.Link>
          <Nav.Link href="#">Transações reais</Nav.Link>
          <Nav.Link href="/categorias">Categorias</Nav.Link>
        </Nav>
      </Navbar>
      <BrowserRouter>
        <Switch>
          <Route path="/categorias"><CategoriesView /></Route>
          <Route path="/"><Home /></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

const Home = () => (
  <h1>Início.</h1>
);
