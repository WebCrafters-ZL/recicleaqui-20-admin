import React, { useState } from "react";
import "../styles/Historico.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer, CartesianGrid
} from "recharts";

interface HistoricoItem {
  id: number;
  usuario: string;
  acao: string;
  data: string;
}

const todosOsRegistros: HistoricoItem[] = [
  { id: 1, usuario: "Maria Silva", acao: "Registro de descarte criado", data: "2025-09-10 14:52" },
  { id: 2, usuario: "João Souza", acao: "Pagamento recebido", data: "2025-09-10 09:30" },
  { id: 3, usuario: "Ana Lima", acao: "Denúncia de descarte registrada", data: "2025-08-09 16:45" },
  { id: 4, usuario: "Carlos Andrade", acao: "Registro de descarte criado", data: "2025-08-09 11:20" },
  { id: 5, usuario: "Pedro Martins", acao: "Pagamento recebido", data: "2025-07-08 18:00" },
  { id: 6, usuario: "Juliana Barros", acao: "Pagamento recebido", data: "2025-07-15 12:00" },
  { id: 7, usuario: "Ricardo Mendes", acao: "Registro de descarte criado", data: "2025-06-21 10:15" },
  { id: 8, usuario: "Fernanda Costa", acao: "Denúncia de descarte registrada", data: "2025-06-25 08:30" },
];

const dadosGrafico = [
  { mes: "Junho", mesNumero: "06", descartes: 40, denuncias: 24, pagamentos: 24 },
  { mes: "Julho", mesNumero: "07", descartes: 30, denuncias: 13, pagamentos: 22 },
  { mes: "Agosto", mesNumero: "08", descartes: 20, denuncias: 48, pagamentos: 30 },
  { mes: "Setembro", mesNumero: "09", descartes: 27, denuncias: 39, pagamentos: 20 },
];

const Historico: React.FC = () => {
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);

  const handleGraficoClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const mesClicado = data.activePayload[0].payload.mesNumero;
      setMesSelecionado(mesClicado === mesSelecionado ? null : mesClicado);
    }
  };

  const registrosFiltrados = mesSelecionado
    ? todosOsRegistros.filter(item => item.data.startsWith(`2025-${mesSelecionado}`))
    : todosOsRegistros;

  return (
    <section className="historico-page-container">
      <h2>Histórico de Atividades</h2>
      <div className="tabela-container">
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
            {registrosFiltrados.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.usuario}</td>
                <td>{item.acao}</td>
                <td>{item.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
    </section>
  );
};

export default Historico;