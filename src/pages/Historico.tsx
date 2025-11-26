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

const badgeColor = (acao: string) => {
  if (acao.includes("Pagamento")) return "#4caf50";
  if (acao.includes("Denúncia")) return "#ff9800";
  if (acao.includes("descarte")) return "#7bc26f";
  return "#777";
};

const Historico: React.FC = () => {
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>("");

  const handleGraficoClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const mesClicado = data.activePayload[0].payload.mesNumero;
      setMesSelecionado(mesClicado === mesSelecionado ? null : mesClicado);
    }
  };

  // Filtro por mês e busca por usuário ou ação
  const registrosFiltrados = todosOsRegistros.filter(item => {
    const mesMatch = mesSelecionado ? item.data.startsWith(`2025-${mesSelecionado}`) : true;
    const buscaMatch =
      !busca ||
      item.usuario.toLowerCase().includes(busca.toLowerCase()) ||
      item.acao.toLowerCase().includes(busca.toLowerCase());
    return mesMatch && buscaMatch;
  });

  return (
    <section className="historico-page-container" style={{maxWidth:"960px", margin:"0 auto"}}>
      <h2 style={{ fontSize: "2.2rem", marginBottom: "1.2rem" }}>Histórico de Atividades</h2>
      <div className="historico-grafico-area" style={{ marginBottom: "2.2rem", borderRadius: 12, background: "#eefae7", padding: "1.2rem", boxShadow: "0 3px 16px #0001" }}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={dadosGrafico}
            margin={{ top: 35, right: 30, left: 0, bottom: 8 }}
            onClick={handleGraficoClick}
            cursor="pointer"
          >
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="4 4" />
            <Bar dataKey="descartes" fill="#7bc26f" name="Descartes" />
            <Bar dataKey="denuncias" fill="#ff9800" name="Denúncias" />
            <Bar dataKey="pagamentos" fill="#4caf50" name="Pagamentos" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{
          textAlign: "center",
          marginTop: -20,
          fontSize: 15,
          color: "#444"
        }}>
          {mesSelecionado ?
            <strong>Mês selecionado: {dadosGrafico.find(g => g.mesNumero === mesSelecionado)?.mes}</strong>
            : "Clique em um mês para filtrar."}
        </div>
      </div>
      <div className="filtros-historico-area" style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem" }}>
        <input
          type="text"
          placeholder="Buscar usuário ou ação..."
          value={busca}
          style={{
            padding: "7px 14px",
            borderRadius: "7px",
            border: "1px solid #7bc26f",
            width: "260px",
          }}
          onChange={e => setBusca(e.target.value)}
        />
        <button onClick={() => { setMesSelecionado(null); setBusca(""); }}
          style={{
            background: "#4caf50", color: "#fff",
            borderRadius: "6px", padding: "7px 16px", border: "none", height: 36, cursor: "pointer"
          }}>Limpar Filtros</button>
      </div>
      <div className="tabela-container" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th>ID</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.map((item, idx) => (
              <tr key={item.id} style={{ background: idx % 2 === 0 ? "#eefae7" : "#fff", transition: "background 0.3s" }}>
                <td>{item.id}</td>
                <td>{item.usuario}</td>
                <td>
                  <span style={{
                    display: "inline-block",
                    background: badgeColor(item.acao),
                    color: "#fff", fontWeight: 500,
                    fontSize: 12, borderRadius: "10px", padding: "2px 12px"
                  }}>{item.acao}</span>
                </td>
                <td>{item.data}</td>
              </tr>
            ))}
            {registrosFiltrados.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#bbb", padding: "2rem" }}>
                  Nenhum registro encontrado para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Historico;
