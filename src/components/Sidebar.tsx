// src/components/Sidebar.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaHistory,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/Sidebar.css";
import logo from "../assets/logo.png";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("fakeLoggedUser");
    navigate("/login");
  };

  return (
    <>
      {/* CSS específico do botão sair */}
      <style>
        {`
          .logout-button {
            transition: background-color 0.2s ease, color 0.2s ease;
          }
          .logout-button:hover {
            background-color: #b00020 !important;
            color: #ffffff !important;
          }
          .logout-button:hover .nav-icon {
            color: #ffffff !important;
          }
        `}
      </style>

      <aside className="sidebar-container">
        <div className="sidebar-header">
          <h1>RecicleAqui</h1>
          <img src={logo} alt="RecicleAqui Logo" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-button ${isActive("/homeusuario") ? "active" : ""}`}
            onClick={() => navigate("/homeusuario")}
          >
            <FaTachometerAlt className="nav-icon" />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-button ${
              isActive("/homeusuario/historico") ? "active" : ""
            }`}
            onClick={() => navigate("/homeusuario/historico")}
          >
            <FaHistory className="nav-icon" />
            <span>Histórico</span>
          </button>

          <button
            className={`nav-button ${
              isActive("/homeusuario/pedidos") ? "active" : ""
            }`}
            onClick={() => navigate("/homeusuario/pedidos")}
          >
            <FaClipboardList className="nav-icon" />
            <span>Pedidos de Coleta</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className={`nav-button profile-button ${
              isActive("/homeusuario/perfil") ? "active" : ""
            }`}
            onClick={() => navigate("/homeusuario/perfil")}
          >
            <FaUserCircle className="nav-icon" />
            <span>Perfil</span>
          </button>

          <button className="nav-button logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
