import React from "react";
import Header from "../components/Header";
import darkBanner from "../assets/dark-recycle.png";
import "../styles/Home.css";

const Home = ({ onNavigate }) => (
  <div className="admin-home-full">
    <Header onNavigate={onNavigate} />
    <main className="main-content-full">
      <section className="welc-section">
        <div>
          <h2>Bem-vindo ao Painel Administrativo</h2>
          <p>
            Gerencie empresas, usuários, denúncias e descartes de lixo eletrônico de forma centralizada e segura.
            <br/><br/>
            <b>Transforme dados em impacto sustentável!</b>
          </p>
          <ul className="feature-list">
            <li>📍 Visualização de pontos de coleta</li>
            <li>🔎 Análise de descartes/denúncias</li>
            <li>⚙️ Cadastro de empresas e usuários</li>
            <li>🗺️ Acompanhamento em mapas interativos</li>
          </ul>
        </div>
        <img
          src={darkBanner}
          alt="Reciclagem verde escura"
          className="banner-image"
        />
      </section>
      <section className="about-section">
        <h3>Sobre o RecicleAqui</h3>
        <p>
          Ferramenta inovadora que conecta cidadãos, gestores e empresas engajados na responsabilidade ambiental.
        </p>
      </section>
    </main>
  </div>
);

export default Home;
