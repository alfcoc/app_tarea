import React from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";
const Menu = () => {
  return (
    <nav className="sidebar">
      <h2>Menú</h2>
      <ul>
        <li>
          <Link to="/tareas">📋 Tareas</Link>
        </li>
        <li>
          <Link to="/usuarios">👤 Usuarios</Link>
        </li>
        <li>
          <a href="/logout">🚪 Cerrar Sesión</a>
        </li>
      </ul>
    </nav>
  );
};
export default Menu;
