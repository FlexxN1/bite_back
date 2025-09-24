import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar bg-dark text-white p-3">
      <Link to="/" className="me-3">Inicio</Link>
      <Link to="/products" className="me-3">Productos</Link>
      <Link to="/users">Usuarios</Link>
    </nav>
  );
}