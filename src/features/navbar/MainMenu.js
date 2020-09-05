import React from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function MainMenu() {
  const history = useHistory();
  const location = useLocation();

  return (
    <Navbar className="mb-3" bg="dark" variant="dark">
      <Navbar.Brand href="#" onClick={() => history.push('/')}>Moneycog</Navbar.Brand>
      <Nav className="mr-auto">
        {menuLinks.map((it, index) => (
          <Nav.Link
            href="#"
            onClick={() => history.push(it.url)} key={index}
            active={it.url === location.pathname}
          >
            {it.label}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
}

const menuLinks = [
  { url: '/', label: 'Início' },
  { url: 'not-implemented', label: 'Plano mensal' },
  { url: 'not-implemented', label: 'Plano semanal' },
  { url: 'not-implemented', label: 'Transações reais' },
  { url: '/categorias', label: 'Categorias' },
];
