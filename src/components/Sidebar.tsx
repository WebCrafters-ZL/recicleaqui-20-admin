import React from "react";
import {
  FaTachometerAlt,
  FaDollarSign,
  FaHistory,
  FaRegClipboard,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

interface SidebarProps {
  active: string;
}

const Sidebar: React.FC<SidebarProps> = ({ active }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aqui você pode adicionar lógica de logout (limpar token, etc)
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="logo">RecicleAqui</div>
      <nav className="nav-buttons">
        <button
          className={active === "dashboard" ? "active" : ""}
          onClick={() => navigate("/homeusuario")}
          type="button"
        >
          <FaTachometerAlt className="icon" />
          <span>Dashboard</span>
        </button>
        <button
          className={active === "faturamento" ? "active" : ""}
          onClick={() => navigate("/homeusuario/faturamento")}
          type="button"
        >
          <FaDollarSign className="icon" />
          <span>Faturamento</span>
        </button>
        <button
          className={active === "historico" ? "active" : ""}
          onClick={() => navigate("/homeusuario/historico")}
          type="button"
        >
          <FaHistory className="icon" />
          <span>Histórico</span>
        </button>
        <button
          className={active === "pedidos" ? "active" : ""}
          onClick={() => navigate("/homeusuario/pedidos")}
          type="button"
        >
          <FaRegClipboard className="icon" />
          <span>Pedidos de Coleta</span>
        </button>
      </nav>
      {/* Botão de sair fixado na parte inferior */}
      <div className="logout-container">
        <button className="logout-button" type="button" onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
