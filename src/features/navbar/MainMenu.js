import React from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { BsArrowLeftRight, BsBoxArrowLeft, BsCalendar, BsCalendarFill, BsFillHouseDoorFill, BsFillTagFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../auth/authDuck';

export default function MainMenu() {
  const dispatch = useDispatch();
  const isAuthorized = useSelector((s) => s.auth.isAuthorized);
  const user = useSelector((s) => s.auth.user);
  const history = useHistory();
  const location = useLocation();

  const [isExpanded, setExpanded] = React.useState(false);

  if (!isAuthorized || !user) {
    return null;
  }

  const onBrandClick = () => {
    history.push('/');
  }

  const onToggleClick = () => {
    setExpanded(!isExpanded);
  }

  const handleLogoutClick = () => {
    if (window.confirm('Vai sair mesmo?')) {
      dispatch(logout());
    }
  }

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
      <Navbar.Brand className="cursor-pointer" onClick={onBrandClick}>
        Moneycog
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="main-navbar-collase" onClick={onToggleClick} />
      <Navbar.Collapse id="main-navbar-collase">
        <Nav className="mr-auto">
          {menuLinks.map((link, index) => (
            <Nav.Link key={index} eventKey={link.url} active={link.url === location.pathname}>
              {link.icon} {link.label}
            </Nav.Link>
          ))}
        </Nav>
        <Navbar.Text className="mr-3">
          Olá, <strong>{user.displayName || user.email || 'Usuário'}</strong>
        </Navbar.Text>
        <br />
        <Navbar.Text>
          <Button
            variant="outline-light"
            className="d-flex align-items-center mr-4"
            onClick={handleLogoutClick}
          >
            <BsBoxArrowLeft />
            <span className="pl-2">Sair</span>
          </Button>
        </Navbar.Text>
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
