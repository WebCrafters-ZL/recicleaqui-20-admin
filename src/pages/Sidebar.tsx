import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaFileInvoiceDollar, 
  FaHistory, 
  FaClipboardList,
  FaUserCircle, 
  FaSignOutAlt  
} from "react-icons/fa";
import "../styles/Sidebar.css";
import logo from "../assets/logo.png"; 

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h1>RecicleAqui</h1>
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
          className={`nav-button ${isActive("/homeusuario/faturamento") ? "active" : ""}`}
          onClick={() => navigate("/homeusuario/faturamento")}
        >
          <FaFileInvoiceDollar className="nav-icon" />
          <span>Faturamento</span>
        </button>
        <button
          className={`nav-button ${isActive("/homeusuario/historico") ? "active" : ""}`}
          onClick={() => navigate("/homeusuario/historico")}
        >
          <FaHistory className="nav-icon" />
          <span>Histórico</span>
        </button>
        <button
          className={`nav-button ${isActive("/homeusuario/pedidos") ? "active" : ""}`}
          onClick={() => navigate("/homeusuario/pedidos")}
        >
          <FaClipboardList className="nav-icon" />
          <span>Pedidos de Coleta</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        {/* --- BOTÃO DE PERFIL ADICIONADO AQUI --- */}
        <button 
          className={`nav-button profile-button ${isActive("/homeusuario/perfil") ? "active" : ""}`}
          onClick={() => navigate("/homeusuario/perfil")}
        >
          <FaUserCircle className="nav-icon" />
          <span>Perfil</span>
        </button>
        
        <button className="nav-button logout-button">
          <FaSignOutAlt className="nav-icon" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;