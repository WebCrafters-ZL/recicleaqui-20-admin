import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import "../styles/HomeUsuario.css";

const getActiveSection = (pathname: string): string => {
  if (pathname.includes("/historico")) return "historico";
  if (pathname.includes("/pedidos")) return "pedidos";
  return "dashboard";
};

const HomeUsuario: React.FC = () => {
  const location = useLocation();
  const active = getActiveSection(location.pathname);

  return (
    <div className="home-container">
      <Sidebar active={active} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeUsuario;
