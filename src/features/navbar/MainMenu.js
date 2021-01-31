import React from 'react';
import { useHistory, useLocation } from "react-router-dom";
import capitalize from "lodash.capitalize";
import range from "lodash.range";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {
  BsArrowLeftRight,
  BsBoxArrowLeft,
  BsCalendar,
  BsCalendarFill,
  BsFillHouseDoorFill,
  BsWrench,
  BsFillTagFill,
} from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../auth/authDuck';
import { monthToString } from '../transactions/dates';
import { MonthContext } from '../../app/contexts';
import ProjectSelector from '../projects/ProjectSelector';

export default function MainMenu() {
  const dispatch = useDispatch();
  const { month, setMonth } = React.useContext(MonthContext);
  const isAuthorized = useSelector((s) => s.auth.isAuthorized);
  const history = useHistory();
  const location = useLocation();

  const [isExpanded, setExpanded] = React.useState(false);

  if (!isAuthorized) {
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
    if (!Number.isNaN(parseInt(url, 10))) {
      // then it's an eventKey from handleMonthsDropdownSelect, ignore it.
      // (this condition is a weird workaround for a leaking selection event)
      return;
    }

    if (url.startsWith('project-selector')) {
      // when it's an eventKey from projects selector component, ignore it.
      // (yes, another weird condition.)
      return;
    }

    try {
      history.push(url);
    } finally {
      setExpanded(false);
    }
  };

  const handleMonthsDropdownSelect = (monthKey) => {
    const selectedMonthIndex = parseInt(monthKey, 10) - 1;
    if (Number.isNaN(selectedMonthIndex)) {
      return;
    }

    setMonth(selectedMonthIndex);
  };

  return (
    <Navbar
      className="vw-100"
      bg="dark"
      variant="dark"
      fixed="top"
      expand="xl"
      expanded={isExpanded}
      onSelect={handleSelect}
    >
      <Navbar.Brand className="cursor-pointer" onClick={onBrandClick}>
        Moneycog
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="main-navbar-collase" onClick={onToggleClick} />
      <Navbar.Collapse id="main-navbar-collase">
        <Nav className="mr-auto">
          {menuLinks.map((link, index) => Array.isArray(link.options) ? (
            <NavDropdown key={index} title={<>{link.icon} {link.label}</>} id={link.id}>
              {link.options.map((subLink, subIndex) => (
                <NavDropdown.Item
                  key={`${link.id}-${subIndex}`}
                  eventKey={subLink.url}
                  active={subLink.url === location.pathname}
                >
                  {subLink.icon} {subLink.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          ) : (
            <Nav.Link key={index} eventKey={link.url} active={link.url === location.pathname}>
              {link.icon} {link.label}
            </Nav.Link>
          ))}
        </Nav>
        <br />
        <DropdownButton
          id="main-month-dropdown"
          variant="secondary"
          className="mr-2"
          title={capitalize(monthToString(month))}
          onSelect={handleMonthsDropdownSelect}
        >
          {range(1, 13).map((monthKey) => (
            <Dropdown.Item key={monthKey} eventKey={monthKey}>
              {capitalize(monthToString(monthKey - 1))}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <br />
        <ProjectSelector className="mr-2" />
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
  { url: '/inicio', label: 'Início', icon: <BsFillHouseDoorFill /> },
  { url: '/transacoes', label: 'Transações reais', icon: <BsArrowLeftRight /> },
  { url: '/orçamento-mensal', label: 'Orçamento mensal', icon: <BsCalendarFill /> },
  { url: '/orçamento-semanal', label: 'Orçamento semanal', icon: <BsCalendar /> },
  { id: 'main-configs-dropdown', label: 'Configurações', icon: <BsWrench />, options: [
    { url: '/categorias', label: 'Categorias', icon: <BsFillTagFill /> },
  ]},
];
