import React from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { BsArrowLeftRight, BsCalendar, BsCalendarFill, BsFillHouseDoorFill, BsFillTagFill } from 'react-icons/bs';

export default function MainMenu() {
  const history = useHistory();
  const location = useLocation();

  const [isExpanded, setExpanded] = React.useState(false);

  const handleSelect = (url) => {
    history.push(url);
    setExpanded(false);
  };

  return (
    <Navbar
      className="vw-100"
      bg="dark"
      variant="dark"
      fixed="top"
      expand="lg"
      expanded={isExpanded}
      onSelect={handleSelect}
    >
      <Navbar.Brand className="cursor-pointer" onClick={() => history.push('/')}>
        Moneycog
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="main-navbar-collase" onClick={() => setExpanded(!isExpanded)} />
      <Navbar.Collapse id="main-navbar-collase">
        <Nav className="mr-auto">
          {menuLinks.map((link, index) => (
            <Nav.Link key={index} eventKey={link.url} active={link.url === location.pathname}>
              {link.icon} {link.label}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

const menuLinks = [
  { url: '/', label: 'Início', icon: <BsFillHouseDoorFill /> },
  { url: '/transacoes', label: 'Transações reais', icon: <BsArrowLeftRight /> },
  { url: '/orçamento-mensal', label: 'Orçamento mensal', icon: <BsCalendarFill /> },
  { url: '/orçamento-semanal', label: 'Orçamento semanal', icon: <BsCalendar /> },
  { url: '/categorias', label: 'Categorias', icon: <BsFillTagFill /> },
];
