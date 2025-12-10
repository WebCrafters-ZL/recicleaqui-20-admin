// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
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
  lines: MaterialLine[];
  createdAt: string;
};

type WeekPoint = { label: string; pendentes: number; aceitos: number; recebidos: number };

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    const p = payload[0];
    return (
      <div className="custom-tooltip-chart">
        <p className="label">{label}</p>
        <p className="intro">
          {p.name}: <strong>{p.value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const [discards, setDiscards] = useState<Discard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
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
            (data as any)?.message || "Erro ao carregar dados do dashboard."
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
        setError(e.message || "Erro ao buscar dados do dashboard.");
        setDiscards([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const now = new Date();

  const totals = useMemo(() => {
    let pend = 0;
    let aceitos = 0;
    let recebidos = 0;

    discards.forEach(d => {
      const dt = new Date(d.createdAt);
      if (Number.isNaN(dt.getTime())) return;
      // considera últimos 30 dias
      const diffDays = (now.getTime() - dt.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 30) return;

      if (d.status === "COMPLETED") recebidos += 1;
      else if (d.status === "OFFERED" || d.status === "SCHEDULED") aceitos += 1;
      else pend += 1;
    });

    return { pend, aceitos, recebidos };
  }, [discards, now]);

  const weekData: WeekPoint[] = useMemo(() => {
    const base: WeekPoint[] = [
      { label: "Dom", pendentes: 0, aceitos: 0, recebidos: 0 },
      { label: "Seg", pendentes: 0, aceitos: 0, recebidos: 0 },
      { label: "Ter", pendentes: 0, aceitos: 0, recebidos: 0 },
      { label: "Qua", pendentes: 0, aceitos: 0, recebidos: 0 },
      { label: "Qui", pendentes: 0, aceitos: 0, recebidos: 0 },
      { label: "Sex", pendentes: 0, aceitos: 0, recebidos: 0 },
      { label: "Sáb", pendentes: 0, aceitos: 0, recebidos: 0 },
    ];

    discards.forEach(d => {
      const dt = new Date(d.createdAt);
      if (Number.isNaN(dt.getTime())) return;
      const diffDays = (now.getTime() - dt.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 7) return;
      const idx = dt.getDay(); // 0-6
      if (idx < 0 || idx > 6) return;

      if (d.status === "COMPLETED") base[idx].recebidos += 1;
      else if (d.status === "OFFERED" || d.status === "SCHEDULED")
        base[idx].aceitos += 1;
      else base[idx].pendentes += 1;
    });

    return base;
  }, [discards, now]);

  const areaData = useMemo(
    () =>
      weekData.map(d => ({
        label: d.label,
        value: d.recebidos + d.aceitos,
      })),
    [weekData]
  );

  return (
    <>
      <style>{dashboardStyles}</style>
      <div className="dashboard-page-container">
        <h1 className="dashboard-title">Visão geral</h1>

        {error && <div className="dashboard-error">{error}</div>}

        <div className="kpi-row">
          <div className="kpi-card green">
            <span>Recebidos (30 dias)</span>
            <strong>{totals.recebidos}</strong>
          </div>
          <div className="kpi-card amber">
            <span>Aceitos / agendados</span>
            <strong>{totals.aceitos}</strong>
          </div>
          <div className="kpi-card grey">
            <span>Pendentes / outros</span>
            <strong>{totals.pend}</strong>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <div className="card-header">
              <span className="card-title">Movimentação na semana</span>
            </div>
            <p className="card-subtitle">
              Distribuição diária de pedidos pendentes, aceitos e recebidos nos
              últimos 7 dias.
            </p>
            <div className="chart-interactive-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weekData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#1f261f"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9fb59c", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9fb59c", fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="pendentes"
                    stackId="a"
                    fill="#9e9e9e"
                    name="Pendentes"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="aceitos"
                    stackId="a"
                    fill="#ffb300"
                    name="Aceitos"
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
            </div>
          </div>

          <div className="stats-card">
            <div className="card-header">
              <span className="card-title">Fluxo concluído</span>
            </div>
            <p className="card-subtitle">
              Evolução de pedidos aceitos/recebidos ao longo da semana.
            </p>
            <div className="chart-interactive-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={areaData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorConcluido" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#7bc26f"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="#7bc26f"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="#1f261f"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9fb59c", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9fb59c", fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#7bc26f"
                    fill="url(#colorConcluido)"
                    strokeWidth={2}
                    name="Aceitos + recebidos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {loading && (
          <div className="dashboard-loading">Carregando dados do dashboard...</div>
        )}
      </div>
    </>
  );
};

const dashboardStyles = `
.dashboard-page-container {
  min-height: 100vh;
  padding: 24px 32px;
  background: radial-gradient(circle at top left, #1b3b26, #050706);
  box-sizing: border-box;
  color: #e8ffe1;
}

.dashboard-title {
  margin: 0 0 10px;
  font-size: 1.8rem;
}

.dashboard-error {
  background: #361b1b;
  border-radius: 8px;
  border: 1px solid #ff8b8b;
  color: #ffbcbc;
  padding: 8px 10px;
  font-size: 0.86rem;
  margin-bottom: 10px;
}

.kpi-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.kpi-card {
  flex: 1 1 160px;
  border-radius: 12px;
  padding: 10px 14px;
  color: #f5fff3;
}
.kpi-card span {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.kpi-card strong {
  display: block;
  margin-top: 4px;
  font-size: 1.4rem;
}
.kpi-card.green {
  background: rgba(76,175,80,0.16);
  border: 1px solid rgba(76,175,80,0.6);
}
.kpi-card.amber {
  background: rgba(255,193,7,0.16);
  border: 1px solid rgba(255,193,7,0.6);
}
.kpi-card.grey {
  background: rgba(158,158,158,0.2);
  border: 1px solid rgba(158,158,158,0.6);
}

.stats-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.2fr);
  gap: 16px;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stats-card {
  background: #151915;
  border-radius: 14px;
  border: 1px solid rgba(124,194,111,0.12);
  padding: 14px 16px 12px;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 0.98rem;
  font-weight: 600;
  color: #e8ffe1;
}

.card-subtitle {
  margin: 4px 0 10px;
  font-size: 0.84rem;
  color: #a4b8a1;
}

.chart-interactive-wrapper {
  width: 100%;
  height: 220px;
}

.custom-tooltip-chart {
  background: #111511;
  border-radius: 8px;
  border: 1px solid #3a4b3a;
  padding: 6px 10px;
}
.custom-tooltip-chart .label {
  margin: 0 0 2px;
  font-size: 0.8rem;
  color: #b7d9b0;
}
.custom-tooltip-chart .intro {
  margin: 0;
  font-size: 0.86rem;
  color: #e8ffe1;
}

.dashboard-loading {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #a4b8a1;
}
`;

export default Dashboard;
