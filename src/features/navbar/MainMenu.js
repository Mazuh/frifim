import React from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function MainMenu() {
  const history = useHistory();
  const location = useLocation();

  return (
    <Navbar className="mb-3" bg="dark" variant="dark">
      <Navbar.Brand onClick={() => history.push('/')}>Moneycog</Navbar.Brand>
      <Nav className="mr-auto">
        {menuLinks.map((link, index) => (
          <Nav.Link
            onClick={() => history.push(link.url)} key={index}
            active={link.url === location.pathname}
          >
            {link.label}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
}

const menuLinks = [
  { url: '/', label: 'Início' },
  { url: '/orçamento-mensal', label: 'Orçamento mensal' },
  { url: '/orçamento-semanal', label: 'Orçamento semanal' },
  { url: 'not-implemented', label: 'Transações reais' },
  { url: '/categorias', label: 'Categorias' },
];
