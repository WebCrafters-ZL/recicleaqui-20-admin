import React from 'react';
import '../styles/Dashboard.css';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from "recharts";

// --- Dados Mockados ---
const faturamentoData = [
    { day: "Segunda", value: 180 }, { day: "Terça", value: 280 }, { day: "Quarta", value: 210 },
    { day: "Quinta", value: 390 }, { day: "Sexta", value: 250 }, { day: "Sábado", value: 480 },
    { day: "Domingo", value: 280 },
];
const vendasData = [
    { day: "Segunda", value: 150 }, { day: "Terça", value: 250 }, { day: "Quarta", value: 180 },
    { day: "Quinta", value: 280 }, { day: "Sexta", value: 200 }, { day: "Sábado", value: 350 },
    { day: "Domingo", value: 220 },
];
const entregasData = [
    { pedido: "Nº 22", desc: "Combo 1", valor: "22,00", horario: "Hoje 15:45", status: "Visto", statusClass: "visto" },
    { pedido: "Nº 21", desc: "Combo 2", valor: "28,00", horario: "Hoje 14:14", status: "Preparando", statusClass: "preparando" },
    { pedido: "Nº 20", desc: "Combo 3", valor: "32,00", horario: "Hoje 12:54", status: "Finalizado", statusClass: "finalizado" },
];

const CustomTooltip = (props: any) => {
  if (props.active && props.payload && props.payload.length) {
    return (
      <div className="custom-tooltip-chart">
        <p className="label">{`${props.label}`}</p>
        <p className="intro">{`R$ ${props.payload[0].value},00`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-page-container">
            <h1 className="dashboard-title">Dashboard</h1>
            
            <div className="stats-grid">
                <div className="stats-card">
                    <div className="card-header">
                        <span className="card-title">Receita (Último Mês)</span>
                    </div>
                    <p className="card-value">R$ 1.234,00</p>
                    <div className="chart-interactive-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={faturamentoData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#777", fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#777", fontSize: 11 }} />
                                <Tooltip cursor={{ fill: 'rgba(76, 175, 80, 0.1)' }} content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="#4caf50" radius={[4, 4, 0, 0]} name="Receita" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="card-header">
                        <span className="card-title">Pendentes (Último mês)</span>
                    </div>
                    <p className="card-value">R$ 2.345,00</p>
                    <div className="chart-interactive-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={vendasData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPendente" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fbc02d" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#fbc02d" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#777", fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#777", fontSize: 11 }} />
                                <Tooltip cursor={{ stroke: '#fbc02d', strokeWidth: 1 }} content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="value" stroke="#fbc02d" fill="url(#colorPendente)" strokeWidth={2} name="Pendentes"/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <h2 className="deliveries-title">Últimas Entregas</h2>
            <div className="deliveries-table">
                <div className="table-header">
                    <span>Pedido</span><span>Desc.</span><span>Valor</span><span>Horário</span><span>Status</span>
                </div>
                {entregasData.map((item, index) => (
                    <div key={index} className="table-row">
                        <div className="pedido-cell">
                            <div className="pedido-icon"></div>
                            <span>{item.pedido}</span>
                        </div>
                        <span>{item.desc}</span>
                        <span>{item.valor}</span>
                        <span>{item.horario}</span>
                        <div className="status-cell">
                            <span className={`status-badge ${item.statusClass}`}>{item.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;