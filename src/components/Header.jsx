import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const location = useLocation();

  return (
    <header className="admin-header">
      <h1 className="logo">RecicleAqui Admin</h1>
      <div className="header-actions">
        {/* Evita renderizar links para a página atual */}
        {location.pathname !== "/cadastro" && (
          <Link to="/cadastro" className="btn-link secondary">
            <span className="btn-icon">📝</span> Cadastro
          </Link>
        )}
        {location.pathname !== "/login" && (
          <Link to="/login" className="btn-link primary">
            <span className="btn-icon">🔐</span> Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
