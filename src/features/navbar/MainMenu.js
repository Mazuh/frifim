import React from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { BsArrowLeftRight, BsCalendar, BsCalendarFill, BsFillHouseDoorFill, BsFillTagFill } from 'react-icons/bs';

export default function MainMenu() {
  const history = useHistory();
  const location = useLocation();

  return (
    <Navbar className="mb-3" bg="dark" variant="dark">
      <Navbar.Brand className="cursor-pointer" onClick={() => history.push('/')}>
        Moneycog
      </Navbar.Brand>
      <Nav className="mr-auto">
        {menuLinks.map((link, index) => (
          <Nav.Link
            onClick={() => history.push(link.url)} key={index}
            active={link.url === location.pathname}
          >
            {link.icon} {link.label}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
}

const menuLinks = [
  { url: '/', label: 'Início', icon: <BsFillHouseDoorFill /> },
  { url: '/orçamento-mensal', label: 'Orçamento mensal', icon: <BsCalendarFill /> },
  { url: '/orçamento-semanal', label: 'Orçamento semanal', icon: <BsCalendar /> },
  { url: '/transacoes', label: 'Transações reais', icon: <BsArrowLeftRight /> },
  { url: '/categorias', label: 'Categorias', icon: <BsFillTagFill /> },
];
