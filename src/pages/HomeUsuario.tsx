import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/HomeUsuario.css";

const HomeUsuario: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <section>
            <h2>Dashboard</h2>
            <p>Aqui ficam seus gráficos e KPIs do painel.</p>
          </section>
        );
      case "faturamento":
        return (
          <section>
            <h2>Faturamento</h2>
            <p>Seção para controle financeiro do sistema.</p>
          </section>
        );
      case "historico":
        return (
          <section>
            <h2>Histórico</h2>
            <p>Visualize o histórico das atividades.</p>
          </section>
        );
      case "pedidos":
        return (
          <section>
            <h2>Pedidos de Coleta</h2>
            <p>Pedidos novos, incluindo denúncias e solicitações dos usuários.</p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      <Sidebar onNavigate={setActiveSection} active={activeSection} />
      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default HomeUsuario;
