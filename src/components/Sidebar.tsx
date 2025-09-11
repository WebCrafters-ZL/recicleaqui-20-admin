import React from "react";
import { FaTachometerAlt, FaDollarSign, FaHistory, FaRegClipboard } from "react-icons/fa";
import "../styles/Sidebar.css";

interface SidebarProps {
  onNavigate: (section: string) => void;
  active: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, active }) => {
  return (
    <aside className="sidebar">
      <div className="logo">RecicleAqui</div>
      <nav className="nav-buttons">
        <button
          className={active === "dashboard" ? "active" : ""}
          onClick={() => onNavigate("dashboard")}
          type="button"
        >
          <FaTachometerAlt className="icon" />
          Dashboard
        </button>
        <button
          className={active === "faturamento" ? "active" : ""}
          onClick={() => onNavigate("faturamento")}
          type="button"
        >
          <FaDollarSign className="icon" />
          Faturamento
        </button>
        <button
          className={active === "historico" ? "active" : ""}
          onClick={() => onNavigate("historico")}
          type="button"
        >
          <FaHistory className="icon" />
          Histórico
        </button>
        <button
          className={active === "pedidos" ? "active" : ""}
          onClick={() => onNavigate("pedidos")}
          type="button"
        >
          <FaRegClipboard className="icon" />
          Pedidos de Coleta
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
