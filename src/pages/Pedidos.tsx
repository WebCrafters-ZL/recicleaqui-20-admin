import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "../styles/Pedidos.css";

interface Pedido {
  id: number;
  nome: string;
  endereco: string;
  tipo: string;
  status: string;
  latitude: number;
  longitude: number;
}

interface HistoricoItem {
  id: number;
  usuario: string;
  acao: string;
  data: string;
}

const pedidosMock: Pedido[] = [
  {
    id: 1,
    nome: "Maria Silva",
    endereco: "Rua das Laranjeiras, 123",
    tipo: "Descarte",
    status: "Pendente",
    latitude: -23.561684,
    longitude: -46.625378,
  },
  {
    id: 2,
    nome: "João Souza",
    endereco: "Av. Paulista, 1500",
    tipo: "Pedido de Coleta",
    status: "Pendente",
    latitude: -23.564224,
    longitude: -46.651436,
  },
  {
    id: 3,
    nome: "Ana Lima",
    endereco: "Rua Vergueiro, 780",
    tipo: "Pedido de Coleta",
    status: "Pendente",
    latitude: -23.585,
    longitude: -46.635,
  },
  {
    id: 4,
    nome: "Carlos Andrade",
    endereco: "Rua Augusta, 450",
    tipo: "Descarte",
    status: "Pendente",
    latitude: -23.553,
    longitude: -46.658,
  },
  {
    id: 5,
    nome: "Fernanda Costa",
    endereco: "Av. Brigadeiro Faria Lima, 2200",
    tipo: "Pedido de Coleta",
    status: "Pendente",
    latitude: -23.571,
    longitude: -46.689,
  },
];

const statusIcons: Record<string, string> = {
  Pendente: "🟡",
  Confirmado: "🟢",
  "Em andamento": "🔵",
  Finalizado: "✅",
};

const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosMock);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  const registrarNoHistorico = (pedido: Pedido, novoStatus: string) => {
    const stored = localStorage.getItem("acceptedOrders");
    const lista: HistoricoItem[] = stored ? JSON.parse(stored) : [];
    
    // VERIFICA SE JÁ EXISTE REGISTRO PARA ESSE PEDIDO (evita duplicação)
    const existe = lista.some(item => item.id === pedido.id);
    if (existe) return; // Não registra se já existe

    const agora = new Date();
    const data = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")} ${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;

    lista.push({
      id: pedido.id,
      usuario: pedido.nome,
      acao: `Pedido alterado para "${novoStatus}"`,
      data,
    });

    localStorage.setItem("acceptedOrders", JSON.stringify(lista));
  };

  const handleAceitarPedido = (id: number) => {
    setPedidos(prev =>
      prev.map(p => {
        if (p.id === id && p.status === "Pendente") {
          const atualizado = { ...p, status: "Confirmado" };
          registrarNoHistorico(atualizado, "Confirmado");
          return atualizado;
        }
        if (p.id === id && p.status === "Confirmado") {
          const atualizado = { ...p, status: "Em andamento" };
          registrarNoHistorico(atualizado, "Em andamento");
          return atualizado;
        }
        return p;
      })
    );
  };

  const pedidosFiltrados = pedidos.filter(
    p =>
      (!filtroStatus || p.status === filtroStatus) &&
      (!filtroTipo || p.tipo === filtroTipo)
  );

  return (
    <section className="pedidos-container">
      <h2 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
        Pedidos de Coleta
      </h2>

      <div
        className="filtros-area"
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <label>
          <strong>Status:</strong>
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </label>
        <label>
          <strong>Tipo:</strong>
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="">Todos</option>
            <option value="Descarte">Descarte</option>
            <option value="Pedido de Coleta">Pedido de Coleta</option>
          </select>
        </label>
        <button
          onClick={() => {
            setFiltroStatus("");
            setFiltroTipo("");
          }}
          style={{
            marginLeft: "auto",
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            background: "#4caf50",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Limpar filtros
        </button>
      </div>

      <div
        className="map-area"
        style={{
          marginBottom: "2rem",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 16px #0002",
        }}
      >
        <MapContainer
          center={[-23.563987, -46.654987]}
          zoom={12}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pedidosFiltrados.map(pedido => (
            <Marker
              key={pedido.id}
              position={[pedido.latitude, pedido.longitude]}
            >
              <Popup>
                <strong>{pedido.nome}</strong>
                <br />
                <span>{pedido.endereco}</span>
                <br />
                <b>Tipo:</b> {pedido.tipo}
                <br />
                <b>Status:</b> {statusIcons[pedido.status] || ""}{" "}
                {pedido.status}
                <br />
                {pedido.status === "Pendente" && (
                  <button
                    style={{
                      marginTop: "6px",
                      padding: "4px 10px",
                      color: "#fff",
                      background: "#7bc26f",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                    onClick={() => handleAceitarPedido(pedido.id)}
                  >
                    Aceitar pedido
                  </button>
                )}
                {pedido.status === "Confirmado" && (
                  <button
                    style={{
                      marginTop: "6px",
                      padding: "4px 10px",
                      color: "#fff",
                      background: "#4caf50",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                    onClick={() => handleAceitarPedido(pedido.id)}
                  >
                    Iniciar coleta
                  </button>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="tabela-area" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((pedido, idx) => (
              <tr
                key={pedido.id}
                style={{ background: idx % 2 === 0 ? "#eefae7" : "#fff" }}
              >
                <td>{pedido.id}</td>
                <td>{pedido.nome}</td>
                <td>{pedido.endereco}</td>
                <td>{pedido.tipo}</td>
                <td>
                  {statusIcons[pedido.status] || ""} {pedido.status}
                </td>
                <td>
                  {pedido.status === "Pendente" && (
                    <button
                      title="Aceitar"
                      style={{
                        marginRight: 8,
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        background: "#7bc26f",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                      onClick={() => handleAceitarPedido(pedido.id)}
                    >
                      Aceitar
                    </button>
                  )}
                  {pedido.status === "Confirmado" && (
                    <button
                      title="Iniciar coleta"
                      style={{
                        marginRight: 8,
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        background: "#4caf50",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                      onClick={() => handleAceitarPedido(pedido.id)}
                    >
                      Iniciar
                    </button>
                  )}
                  <button
                    title="Ver detalhes"
                    style={{ marginRight: 8 }}
                    onClick={() => alert(`Ver pedido ${pedido.id}`)}
                  >
                    🔍
                  </button>
                  <button
                    title="Excluir pedido"
                    onClick={() => alert(`Excluir pedido ${pedido.id}`)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pedidosFiltrados.length === 0 && (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#aaa",
            }}
          >
            Nenhum pedido encontrado.
          </div>
        )}
      </div>
    </section>
  );
};

export default Pedidos;
