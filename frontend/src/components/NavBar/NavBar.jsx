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
        <button 
          className="menu" 
          onClick={() => setMenuOpen(!menuOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setMenuOpen(!menuOpen);
            }
          }}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          type="button"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            margin: 0,
            outline: 'none'
          }}
        >
          <span />
          <span />
          <span />
        </button>
        <ul 
          id="navbar-menu"
          className={`navbar-links${menuOpen ? ' open' : ''}`}
          aria-hidden={!menuOpen}
        >
          <li>
            <NavLink to="/reservation" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              Reservar
            </NavLink>
          </li>
          <li>
            <NavLink to="/tariffs" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              Tarifas
            </NavLink>
          </li>
          <li>
            <NavLink to="/rack" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              Rack
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              Reportes
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              Contacto
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;