import React from "react";
import "../styles/Faturamento.css";

const Faturamento: React.FC = () => {
  return (
    <section className="faturamento-container">
      <h2>Faturamento</h2>
      <div className="faturamento-cards">
        <div className="card receita">
          <h3>Receita Total</h3>
          <p>R$ 12.500,00</p>
        </div>
        <div className="card coleta">
          <h3>Coletas Pagas</h3>
          <p>85</p>
        </div>
        <div className="card pendente">
          <h3>Pagamentos Pendentes</h3>
          <p>R$ 1.900,00</p>
        </div>
      </div>
      <div className="grafico-area">
        <p>[Aqui pode vir um gráfico de faturamento por período]</p>
      </div>
    </section>
  );
};

export default Faturamento;
