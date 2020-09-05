import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#">Moneycog</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#">Início</Nav.Link>
          <Nav.Link href="#">Plano mensal</Nav.Link>
          <Nav.Link href="#">Plano semanal</Nav.Link>
          <Nav.Link href="#">Transações reais</Nav.Link>
          <Nav.Link href="#">Categorias</Nav.Link>
        </Nav>
      </Navbar>
    </div>
  );
}

export default App;
