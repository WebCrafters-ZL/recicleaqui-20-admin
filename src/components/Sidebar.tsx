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
// 1. IMPORTAR A FUNÇÃO DE LOGOUT
import { fakeLogout } from "../api/fakeAuth";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // 2. ADICIONAR A FUNÇÃO handleLogout NOVAMENTE
  const handleLogout = () => {
    fakeLogout(); // Limpa os dados do usuário do localStorage
    navigate('/login'); // Redireciona para a tela de login
  };

  return (
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
        <button 
          className={`nav-button profile-button ${isActive("/homeusuario/perfil") ? "active" : ""}`}
          onClick={() => navigate("/homeusuario/perfil")}
        >
          <FaUserCircle className="nav-icon" />
          <span>Perfil</span>
        </button>
        
        {/* 3. ADICIONAR O 'onClick' AO BOTÃO SAIR */}
        <button className="nav-button logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;