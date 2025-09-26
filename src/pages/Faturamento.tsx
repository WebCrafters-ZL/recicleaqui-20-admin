import React from "react";
import "../styles/Faturamento.css";
import {
  ResponsiveContainer, ComposedChart, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid, Bar, Line,
} from "recharts";

const faturamentoMensal = [
  { mes: "Maio", receita: 4000, pendente: 240 },
  { mes: "Junho", receita: 3000, pendente: 139 },
  { mes: "Julho", receita: 2000, pendente: 980 },
  { mes: "Agosto", receita: 2780, pendente: 390 },
  { mes: "Setembro", receita: 1890, pendente: 480 },
];

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

      <div className="grafico-container-faturamento">
        <h3>Balanço de Faturamento Mensal</h3>
        <div className="grafico-wrapper-faturamento">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={faturamentoMensal} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="receita" barSize={30} fill="#4caf50" name="Receita" />
              <Line type="monotone" dataKey="pendente" stroke="#fbc02d" strokeWidth={3} name="Pendentes" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default Faturamento;