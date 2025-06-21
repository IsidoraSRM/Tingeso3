import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar-floating-container">
      <nav className="navbar-floating">
        <NavLink to="/" className="navbar-title">
          KartingRM
        </NavLink>
        <div 
          className="menu" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </div>
        <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <li>
            <NavLink to="/reservation" className="navbar-link" activeClassName="active" onClick={() => setMenuOpen(false)}>
              Reservar
            </NavLink>
          </li>
          <li>
            <NavLink to="/tariffs" className="navbar-link" activeClassName="active" onClick={() => setMenuOpen(false)}>
              Tarifas
            </NavLink>
          </li>
          <li>
            <NavLink to="/rack" className="navbar-link" activeClassName="active" onClick={() => setMenuOpen(false)}>
              Rack
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className="navbar-link" activeClassName="active" onClick={() => setMenuOpen(false)}>
              Reportes
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="navbar-link" activeClassName="active" onClick={() => setMenuOpen(false)}>
              Contacto
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;