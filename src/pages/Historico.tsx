import React, { useState, useEffect } from "react";
import "../styles/Historico.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface HistoricoItem {
  id: number;
  usuario: string;
  acao: string;
  data: string;
}

const dadosGraficoBase = [
  { mes: "Junho", mesNumero: "06", pedidosAceitos: 0 },
  { mes: "Julho", mesNumero: "07", pedidosAceitos: 0 },
  { mes: "Agosto", mesNumero: "08", pedidosAceitos: 0 },
  { mes: "Setembro", mesNumero: "09", pedidosAceitos: 0 },
  { mes: "Outubro", mesNumero: "10", pedidosAceitos: 0 },
  { mes: "Novembro", mesNumero: "11", pedidosAceitos: 0 },
];

const badgeColor = (acao: string) => {
  if (acao.includes("Confirmado")) return "#7bc26f";
  if (acao.includes("Em andamento")) return "#4caf50";
  if (acao.includes("Finalizado")) return "#2196f3";
  return "#777";
};

const Historico: React.FC = () => {
  const [registros, setRegistros] = useState<HistoricoItem[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState(dadosGraficoBase);
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("acceptedOrders");
    if (stored) {
      const parsed: HistoricoItem[] = JSON.parse(stored);
      setRegistros(parsed);
      
      // Calcula pedidos aceitos por mês
      const atualizados = dadosGraficoBase.map((item) => {
        const mesReg = parsed.filter((r) => r.data.startsWith(`2025-${item.mesNumero}`));
        return {
          ...item,
          pedidosAceitos: mesReg.length, // Conta TODOS os pedidos aceitos do mês
        };
      });
      setDadosGrafico(atualizados);
    } else {
      setRegistros([]);
      setDadosGrafico(dadosGraficoBase);
    }
  }, []);

  const handleGraficoClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const mesClicado = data.activePayload[0].payload.mesNumero;
      setMesSelecionado(mesClicado === mesSelecionado ? null : mesClicado);
    }
  };

  const registrosFiltrados = registros.filter((item) => {
    const mesMatch = mesSelecionado ? item.data.startsWith(`2025-${mesSelecionado}`) : true;
    const buscaMatch =
      !busca ||
      item.usuario.toLowerCase().includes(busca.toLowerCase()) ||
      item.acao.toLowerCase().includes(busca.toLowerCase());
    return mesMatch && buscaMatch;
  });

  return (
    <section className="historico-page-container" style={{ maxWidth: "960px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2.2rem", marginBottom: "1.2rem" }}>Histórico de Pedidos Aceitos</h2>

      <div
        className="historico-grafico-area"
        style={{
          marginBottom: "2.2rem",
          borderRadius: 12,
          background: "#eefae7",
          padding: "1.2rem",
          boxShadow: "0 3px 16px #0001",
        }}
      >
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
            <Bar 
              dataKey="pedidosAceitos" 
              fill="#4caf50" 
              name="Pedidos Aceitos"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div
          style={{
            textAlign: "center",
            marginTop: -20,
            fontSize: 15,
            color: "#444",
          }}
        >
          {mesSelecionado ? (
            <strong>
              {`Mês selecionado: ${
                dadosGrafico.find((g) => g.mesNumero === mesSelecionado)?.mes
              } (${dadosGrafico.find((g) => g.mesNumero === mesSelecionado)?.pedidosAceitos || 0} pedidos)`}
            </strong>
          ) : (
            "Clique em um mês para filtrar os pedidos aceitos."
          )}
        </div>
      </div>

      <div className="summary-stats" style={{ 
        display: "flex", 
        gap: "1rem", 
        marginBottom: "1.2rem",
        flexWrap: "wrap"
      }}>
        <div style={{ 
          background: "#e8f5e8", 
          padding: "12px 20px", 
          borderRadius: 8, 
          borderLeft: "4px solid #4caf50" 
        }}>
          <strong>Total de pedidos aceitos:</strong> <span style={{ color: "#4caf50", fontSize: "1.2em" }}>{registros.length}</span>
        </div>
      </div>

      <div
        className="filtros-historico-area"
        style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem" }}
      >
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
          onChange={(e) => setBusca(e.target.value)}
        />
        <button
          onClick={() => {
            setMesSelecionado(null);
            setBusca("");
          }}
          style={{
            background: "#4caf50",
            color: "#fff",
            borderRadius: "6px",
            padding: "7px 16px",
            border: "none",
            height: 36,
            cursor: "pointer",
          }}
        >
          Limpar Filtros
        </button>
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
            {registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    background: idx % 2 === 0 ? "#eefae7" : "#fff",
                    transition: "background 0.3s",
                  }}
                >
                  <td>{item.id}</td>
                  <td>{item.usuario}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        background: badgeColor(item.acao),
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: 12,
                        borderRadius: "10px",
                        padding: "2px 12px",
                      }}
                    >
                      {item.acao}
                    </span>
                  </td>
                  <td>{item.data}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#bbb", padding: "2rem" }}>
                  {mesSelecionado ? "Nenhum pedido aceito neste mês." : "Nenhum pedido aceito ainda."}
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
