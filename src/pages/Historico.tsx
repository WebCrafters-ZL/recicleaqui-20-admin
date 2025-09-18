import React from "react";
import "../styles/Historico.css";

interface HistoricoItem {
  id: number;
  usuario: string;
  acao: string;
  data: string;
}

const historicoData: HistoricoItem[] = [
  { id: 1, usuario: "Maria Silva", acao: "Registro de pedido de coleta criado", data: "2025-09-10 14:52" },
  { id: 2, usuario: "João Souza", acao: "Pagamento recebido", data: "2025-09-10 09:30" },
  { id: 3, usuario: "Ana Lima", acao: "Denúncia de descarte registrada", data: "2025-09-09 16:45" },
];

const Historico: React.FC = () => {
  return (
    <section className="historico-container">
      <h2>Histórico de Atividades</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuário</th>
            <th>Ação</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {historicoData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.usuario}</td>
              <td>{item.acao}</td>
              <td>{item.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Historico;
