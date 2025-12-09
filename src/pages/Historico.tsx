// src/pages/Historico.tsx
import React, { useEffect, useMemo, useState } from "react";
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

const API_BASE_URL = "http://localhost:3000/api/v1";

type MaterialLine = "VERDE" | "MARROM" | "AZUL" | "BRANCA";
type DiscardMode = "PICKUP" | "COLLECTION_POINT";
type DiscardStatus = "PENDING" | "OFFERED" | "SCHEDULED" | "CANCELLED" | "COMPLETED";

type Discard = {
  id: number;
  mode: DiscardMode;
  status: DiscardStatus;
  description?: string;
  lines: MaterialLine[];
  createdAt: string;
  client?: {
    name?: string;
  };
};

type ChartPoint = {
  mesLabel: string;
  mesNumero: string;
  pendentes: number;
  aceitos: number;
  recebidos: number;
};

const STATUS_LABEL: Record<DiscardStatus, string> = {
  PENDING: "Pendente",
  OFFERED: "Com oferta",
  SCHEDULED: "Agendado",
  CANCELLED: "Cancelado",
  COMPLETED: "Recebido",
};

const MONTHS: { mesNumero: string; mesLabel: string }[] = [
  { mesNumero: "01", mesLabel: "Jan" },
  { mesNumero: "02", mesLabel: "Fev" },
  { mesNumero: "03", mesLabel: "Mar" },
  { mesNumero: "04", mesLabel: "Abr" },
  { mesNumero: "05", mesLabel: "Mai" },
  { mesNumero: "06", mesLabel: "Jun" },
  { mesNumero: "07", mesLabel: "Jul" },
  { mesNumero: "08", mesLabel: "Ago" },
  { mesNumero: "09", mesLabel: "Set" },
  { mesNumero: "10", mesLabel: "Out" },
  { mesNumero: "11", mesLabel: "Nov" },
  { mesNumero: "12", mesLabel: "Dez" },
];

const Historico: React.FC = () => {
  const [discards, setDiscards] = useState<Discard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<DiscardStatus | "">("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const rawUser = localStorage.getItem("loggedUser");
        const token = localStorage.getItem("token");
        if (!rawUser || !token) {
          setError("Usuário não autenticado.");
          setDiscards([]);
          return;
        }

        const loggedUser = JSON.parse(rawUser);
        const collectorId: number | undefined =
          loggedUser.collectorId || loggedUser.collector_id || loggedUser.id;

        if (!collectorId) {
          setError("ID de coletor não encontrado para este usuário.");
          setDiscards([]);
          return;
        }

        // Idealmente aqui teria um endpoint de histórico; enquanto isso,
        // reaproveita o mesmo usado em Pedidos (pendentes/aceitos/recebidos).
        const res = await fetch(
          `${API_BASE_URL}/discards/collectors/${collectorId}/pending-pickup`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json().catch(() => ([] as Discard[]));
        if (!res.ok) {
          throw new Error(
            (data as any)?.message || "Erro ao carregar histórico de pedidos."
          );
        }

        let list: Discard[] = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray((data as any).discards)) list = (data as any).discards;

        setDiscards(
          (list || []).map(d => ({
            ...d,
            lines: Array.isArray(d.lines) ? d.lines : [],
            createdAt: d.createdAt || d.created_at || new Date().toISOString(),
          }))
        );
      } catch (e: any) {
        setError(e.message || "Erro ao buscar histórico de pedidos.");
        setDiscards([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const dadosGrafico: ChartPoint[] = useMemo(() => {
    const grouped: ChartPoint[] = MONTHS.map(m => ({
      mesLabel: m.mesLabel,
      mesNumero: m.mesNumero,
      pendentes: 0,
      aceitos: 0,
      recebidos: 0,
    }));

    discards.forEach(d => {
      const date = new Date(d.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const item = grouped.find(g => g.mesNumero === mes);
      if (!item) return;

      if (d.status === "PENDING" || d.status === "CANCELLED") {
        item.pendentes += 1;
      } else if (d.status === "OFFERED" || d.status === "SCHEDULED") {
        item.aceitos += 1;
      } else if (d.status === "COMPLETED") {
        item.recebidos += 1;
      }
    });

    return grouped;
  }, [discards]);

  const registrosFiltrados = useMemo(() => {
    return discards.filter(d => {
      const dt = new Date(d.createdAt);
      const mes = String(dt.getMonth() + 1).padStart(2, "0");
      const mesMatch = mesSelecionado ? mes === mesSelecionado : true;
      const buscaMatch =
        !busca ||
        (d.client?.name || "")
          .toLowerCase()
          .includes(busca.toLowerCase()) ||
        (d.description || "").toLowerCase().includes(busca.toLowerCase());
      const statusMatch = statusFiltro ? d.status === statusFiltro : true;
      return mesMatch && buscaMatch && statusMatch;
    });
  }, [discards, mesSelecionado, busca, statusFiltro]);

  const totalPendentes = discards.filter(
    d => d.status === "PENDING" || d.status === "CANCELLED"
  ).length;
  const totalAceitos = discards.filter(
    d => d.status === "OFFERED" || d.status === "SCHEDULED"
  ).length;
  const totalRecebidos = discards.filter(d => d.status === "COMPLETED").length;

  const handleGraficoClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const mesClicado = data.activePayload[0].payload.mesNumero as string;
      setMesSelecionado(prev => (prev === mesClicado ? null : mesClicado));
    }
  };

  const badgeColor = (status: DiscardStatus) => {
    if (status === "COMPLETED") return "#4caf50";
    if (status === "OFFERED" || status === "SCHEDULED") return "#ffb300";
    if (status === "PENDING") return "#9e9e9e";
    if (status === "CANCELLED") return "#e53935";
    return "#777";
  };

  return (
    <>
      <style>{historicoStyles}</style>
      <section className="historico-page">
        <div className="historico-shell">
          <header className="historico-header">
            <div>
              <h2>Histórico de Coletas</h2>
              <p>
                Acompanhe a evolução dos pedidos ao longo dos meses e filtre por
                status e cliente.
              </p>
            </div>
          </header>

          <div className="historico-top">
            <div className="historico-grafico-card">
              <h3>Pedidos por mês</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={dadosGrafico}
                  margin={{ top: 20, right: 16, left: -10, bottom: 8 }}
                  onClick={handleGraficoClick}
                >
                  <CartesianGrid
                    stroke="#1f261f"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis dataKey="mesLabel" stroke="#9fb59c" />
                  <YAxis stroke="#9fb59c" />
                  <Tooltip
                    contentStyle={{
                      background: "#111511",
                      border: "1px solid #3a4b3a",
                      borderRadius: 8,
                      color: "#e8ffe1",
                      fontSize: 12,
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="pendentes"
                    stackId="a"
                    fill="#9e9e9e"
                    name="Pendentes/Cancelados"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="aceitos"
                    stackId="a"
                    fill="#ffb300"
                    name="Aceitos/Agendados"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="recebidos"
                    stackId="a"
                    fill="#4caf50"
                    name="Recebidos"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="grafico-legend-text">
                {mesSelecionado ? (
                  <>
                    Mês selecionado:{" "}
                    <strong>
                      {
                        MONTHS.find(m => m.mesNumero === mesSelecionado)
                          ?.mesLabel
                      }
                    </strong>
                    {" – "}
                    {dadosGrafico.find(g => g.mesNumero === mesSelecionado)
                      ?.recebidos || 0}{" "}
                    recebidos,{" "}
                    {dadosGrafico.find(g => g.mesNumero === mesSelecionado)
                      ?.aceitos || 0}{" "}
                    aceitos,{" "}
                    {dadosGrafico.find(g => g.mesNumero === mesSelecionado)
                      ?.pendentes || 0}{" "}
                    pendentes.
                  </>
                ) : (
                  "Clique em um mês na barra para filtrar os registros abaixo."
                )}
              </div>
            </div>

            <div className="historico-stats-card">
              <h3>Resumo rápido</h3>
              <div className="stats-grid">
                <div className="stat-box green">
                  <span>Total recebidos</span>
                  <strong>{totalRecebidos}</strong>
                </div>
                <div className="stat-box amber">
                  <span>Aceitos / agendados</span>
                  <strong>{totalAceitos}</strong>
                </div>
                <div className="stat-box grey">
                  <span>Pendentes / cancelados</span>
                  <strong>{totalPendentes}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="historico-filtros">
            <input
              type="text"
              placeholder="Buscar por cliente ou descrição..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
            <select
              value={statusFiltro}
              onChange={e =>
                setStatusFiltro(e.target.value as DiscardStatus | "")
              }
            >
              <option value="">Todos os status</option>
              <option value="PENDING">Pendente</option>
              <option value="OFFERED">Com oferta</option>
              <option value="SCHEDULED">Agendado</option>
              <option value="COMPLETED">Recebido</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
            <button
              onClick={() => {
                setMesSelecionado(null);
                setBusca("");
                setStatusFiltro("");
              }}
            >
              Limpar filtros
            </button>
          </div>

          {error && <div className="historico-error">{error}</div>}

          <div className="historico-table-wrapper">
            {loading ? (
              <div className="historico-empty">Carregando histórico...</div>
            ) : registrosFiltrados.length === 0 ? (
              <div className="historico-empty">
                Nenhum registro encontrado para os filtros atuais.
              </div>
            ) : (
              <table className="historico-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Descrição</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosFiltrados.map(d => (
                    <tr key={d.id}>
                      <td>#{d.id}</td>
                      <td>{d.client?.name || "Cliente"}</td>
                      <td>
                        <span
                          className="status-pill"
                          style={{ backgroundColor: badgeColor(d.status) }}
                        >
                          {STATUS_LABEL[d.status]}
                        </span>
                      </td>
                      <td>{d.description || "—"}</td>
                      <td>{formatDate(d.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const historicoStyles = `
.historico-page {
  min-height: 100vh;
  padding: 24px 32px;
  background: radial-gradient(circle at top left, #1b3b26, #050706);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
}

.historico-shell {
  width: 100%;
  max-width: 1200px;
  background: #101310;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.55);
  border: 1px solid rgba(124,194,111,0.18);
  padding: 20px 22px 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.historico-header h2 {
  margin: 0 0 4px;
  color: #e8ffe1;
  font-size: 1.6rem;
}

.historico-header p {
  margin: 0;
  color: #b7d9b0;
  font-size: 0.9rem;
}

.historico-top {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr);
  gap: 16px;
}

@media (max-width: 900px) {
  .historico-top {
    grid-template-columns: 1fr;
  }
}

.historico-grafico-card,
.historico-stats-card {
  background: #151915;
  border-radius: 14px;
  border: 1px solid rgba(124,194,111,0.12);
  padding: 14px 16px 12px;
  box-sizing: border-box;
}

.historico-grafico-card h3,
.historico-stats-card h3 {
  margin: 0 0 8px;
  color: #e8ffe1;
  font-size: 1rem;
}

.grafico-legend-text {
  margin-top: 6px;
  font-size: 0.84rem;
  color: #a4b8a1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 10px;
}

@media (min-width: 700px) {
  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.stat-box {
  border-radius: 10px;
  padding: 10px 12px;
  color: #f5fff3;
}
.stat-box span {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.stat-box strong {
  display: block;
  margin-top: 4px;
  font-size: 1.2rem;
}

.stat-box.green {
  background: rgba(76,175,80,0.16);
  border: 1px solid rgba(76,175,80,0.6);
}
.stat-box.amber {
  background: rgba(255,193,7,0.16);
  border: 1px solid rgba(255,193,7,0.6);
}
.stat-box.grey {
  background: rgba(158,158,158,0.2);
  border: 1px solid rgba(158,158,158,0.6);
}

.historico-filtros {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.historico-filtros input {
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid #273428;
  background: #0c100d;
  color: #f5fff3;
  min-width: 220px;
  font-size: 0.9rem;
}

.historico-filtros select {
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #273428;
  background: #0c100d;
  color: #f5fff3;
  font-size: 0.9rem;
}

.historico-filtros button {
  border-radius: 999px;
  padding: 7px 16px;
  border: none;
  background: #4caf50;
  color: #061006;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
}

.historico-error {
  background: #361b1b;
  border-radius: 8px;
  border: 1px solid #ff8b8b;
  color: #ffbcbc;
  padding: 8px 10px;
  font-size: 0.86rem;
  margin-top: 6px;
}

.historico-table-wrapper {
  margin-top: 8px;
  background: #151915;
  border-radius: 14px;
  border: 1px solid rgba(124,194,111,0.12);
  padding: 10px 12px;
  box-sizing: border-box;
}

.historico-empty {
  padding: 18px 10px;
  text-align: center;
  color: #a4b8a1;
  font-size: 0.9rem;
}

.historico-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.86rem;
}

.historico-table thead tr {
  background: #171c17;
}

.historico-table th,
.historico-table td {
  padding: 8px 6px;
  text-align: left;
}

.historico-table th {
  color: #8ea88a;
  font-weight: 600;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.historico-table td {
  color: #f5fff3;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}

.historico-table tbody tr:hover {
  background: #111811;
}

.status-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
}
`;

export default Historico;
