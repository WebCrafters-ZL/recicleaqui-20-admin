import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaMapMarkerAlt, FaHistory, FaBoxOpen, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../styles/Sidebar.css";



const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
      </div>
      <nav className="nav-buttons">
        <button
          className={`nav-button ${isActive("/homeusuario") ? "active" : ""}`}
          onClick={() => navigate("/homeusuario")}
        >
          <FaTachometerAlt className="nav-icon" />
          Dashboard
        </button>
        <button
          className={`nav-button ${isActive("/homeusuario/pontos") ? "active" : ""}`}
          onClick={() => navigate("/homeusuario/pontos")}
        >
          <FaMapMarkerAlt className="nav-icon" />
          Pontos de Coleta
        </button>
        <button
          className={`nav-button ${isActive("/homeusuario/historico") ? "active" : ""}`}
          onClick={() => navigate("/homeusuario/historico")}
        >
          <FaHistory className="nav-icon" />
          Histórico de Descartes
        </button>
        <button
          className={`nav-button ${isActive("/homeusuario/produtos") ? "active" : ""}`}
          onClick={() => navigate("/homeusuario/produtos")}
        >
          <FaBoxOpen className="nav-icon" />
          Produtos
        </button>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-button">
          <FaCog className="nav-icon" />
          Configurações
        </button>
        <button className="nav-button">
          <FaSignOutAlt className="nav-icon" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
