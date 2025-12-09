// src/pages/Pedidos.tsx
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaClock, FaSyncAlt, FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

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
    phone?: string;
  };
  address?: {
    addressName?: string;
    number?: string;
    neighborhood?: string;
    postalCode?: string;
    city?: string;
    state?: string;
    latitude?: number | null;
    longitude?: number | null;
  };
  collectionPoint?: {
    name?: string;
    addressName?: string;
    number?: string;
    neighborhood?: string;
    postalCode?: string;
    city?: string;
    state?: string;
    latitude?: number | null;
    longitude?: number | null;
  };
};

const STATUS_LABEL: Record<DiscardStatus, string> = {
  PENDING: "Pendente",
  OFFERED: "Com oferta",
  SCHEDULED: "Agendado",
  CANCELLED: "Cancelado",
  COMPLETED: "Recebido",
};

const STATUS_BADGE_CLASS: Record<DiscardStatus, string> = {
  PENDING: "status-badge pending",
  OFFERED: "status-badge offered",
  SCHEDULED: "status-badge scheduled",
  CANCELLED: "status-badge cancelled",
  COMPLETED: "status-badge completed",
};

const MODE_LABEL: Record<DiscardMode, string> = {
  PICKUP: "Coleta em casa",
  COLLECTION_POINT: "Entrega em ponto",
};

const LINE_LABEL: Record<MaterialLine, string> = {
  VERDE: "Linha Verde",
  MARROM: "Linha Marrom",
  AZUL: "Linha Azul",
  BRANCA: "Linha Branca",
};

type HighFilter = "all" | "pending" | "accepted" | "received";

const Pedidos: React.FC = () => {
  const [discards, setDiscards] = useState<Discard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [highFilter, setHighFilter] = useState<HighFilter>("all");
  const [statusFilter, setStatusFilter] = useState<DiscardStatus | "">("");
  const [modeFilter, setModeFilter] = useState<DiscardMode | "">("");

  const center = useMemo<[number, number]>(() => {
    const withCoords = discards.find(d => {
      const { lat, lng } = getDiscardLatLng(d);
      return lat !== null && lng !== null;
    });
    if (withCoords) {
      const { lat, lng } = getDiscardLatLng(withCoords);
      return [lat || -23.55052, lng || -46.633308];
    }
    return [-23.55052, -46.633308];
  }, [discards]);

  const loadDiscards = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
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
          (data as any)?.message || "Erro ao carregar pedidos de coleta do coletor."
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
      setError(e.message || "Erro ao buscar pedidos de coleta.");
      setDiscards([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDiscards(false);
  }, []);

  const filteredDiscards = useMemo(() => {
    return discards.filter(d => {
      if (highFilter === "pending" && d.status !== "PENDING") return false;
      if (
        highFilter === "accepted" &&
        !(d.status === "OFFERED" || d.status === "SCHEDULED")
      )
        return false;
      if (highFilter === "received" && d.status !== "COMPLETED") return false;

      if (statusFilter && d.status !== statusFilter) return false;
      if (modeFilter && d.mode !== modeFilter) return false;
      return true;
    });
  }, [discards, highFilter, statusFilter, modeFilter]);

  return (
    <>
      <style>{pedidosStyles}</style>
      <div className="pedidos-page">
        <div className="pedidos-shell">
          <header className="pedidos-header">
            <div>
              <h1>Pedidos de Coleta</h1>
              <p>
                Visualize em tempo real os pedidos no mapa e acompanhe os
                detalhes na listagem ao lado.
              </p>
            </div>
            <button
              className="pedidos-refresh"
              onClick={() => loadDiscards(true)}
              disabled={refreshing || loading}
            >
              <FaSyncAlt className={refreshing ? "spin" : ""} />
              {refreshing || loading ? "Atualizando..." : "Atualizar"}
            </button>
          </header>

          <section className="pedidos-filters">
            <div className="high-filter-group">
              <button
                className={`high-filter-btn ${highFilter === "all" ? "active" : ""}`}
                onClick={() => setHighFilter("all")}
              >
                Todos
              </button>
              <button
                className={`high-filter-btn ${
                  highFilter === "pending" ? "active" : ""
                }`}
                onClick={() => setHighFilter("pending")}
              >
                Pendentes
              </button>
              <button
                className={`high-filter-btn ${
                  highFilter === "accepted" ? "active" : ""
                }`}
                onClick={() => setHighFilter("accepted")}
              >
                Aceitos
              </button>
              <button
                className={`high-filter-btn ${
                  highFilter === "received" ? "active" : ""
                }`}
                onClick={() => setHighFilter("received")}
              >
                Recebidos
              </button>
            </div>

            <div className="filter-group">
              <label>Status detalhado</label>
              <select
                value={statusFilter}
                onChange={e =>
                  setStatusFilter(e.target.value as DiscardStatus | "")
                }
              >
                <option value="">Todos</option>
                <option value="PENDING">Pendente</option>
                <option value="OFFERED">Com oferta</option>
                <option value="SCHEDULED">Agendado</option>
                <option value="COMPLETED">Recebido</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Modalidade</label>
              <select
                value={modeFilter}
                onChange={e =>
                  setModeFilter(e.target.value as DiscardMode | "")
                }
              >
                <option value="">Todas</option>
                <option value="PICKUP">Coleta em casa</option>
                <option value="COLLECTION_POINT">Entrega em ponto</option>
              </select>
            </div>

            <div className="filter-counter">
              {filteredDiscards.length} pedido
              {filteredDiscards.length === 1 ? "" : "s"} listado
            </div>
          </section>

          {error && <div className="pedidos-error">{error}</div>}

          <section className="pedidos-main">
            <div className="pedidos-map-wrapper">
              <MapContainer
                center={center}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredDiscards.map(discard => {
                  const { lat, lng } = getDiscardLatLng(discard);
                  if (lat === null || lng === null) return null;
                  const shortAddress = getShortAddress(discard);
                  return (
                    <Marker key={discard.id} position={[lat, lng]}>
                      <Popup>
                        <strong>#{discard.id}</strong> – {MODE_LABEL[discard.mode]}
                        <br />
                        {shortAddress}
                        <br />
                        {discard.description && (
                          <>
                            <em>{truncate(discard.description, 80)}</em>
                            <br />
                          </>
                        )}
                        <span className={STATUS_BADGE_CLASS[discard.status]}>
                          {STATUS_LABEL[discard.status]}
                        </span>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            <div className="pedidos-list-wrapper">
              {loading && !refreshing ? (
                <div className="pedidos-empty">Carregando pedidos...</div>
              ) : filteredDiscards.length === 0 ? (
                <div className="pedidos-empty">
                  Nenhum pedido encontrado para os filtros atuais.
                </div>
              ) : (
                <div className="pedidos-cards">
                  {filteredDiscards.map(discard => {
                    const shortAddress = getShortAddress(discard);
                    return (
                      <article key={discard.id} className="pedido-card">
                        <header className="pedido-card-header">
                          <div>
                            <span className="pedido-id">#{discard.id}</span>
                            <span className="pedido-client">
                              {discard.client?.name || "Cliente"}
                            </span>
                          </div>
                          <span className={STATUS_BADGE_CLASS[discard.status]}>
                            {STATUS_LABEL[discard.status]}
                          </span>
                        </header>

                        <div className="pedido-card-body">
                          <div className="pedido-row">
                            <strong>Tipo:</strong> {MODE_LABEL[discard.mode]}
                          </div>
                          <div className="pedido-row">
                            <strong>Materiais:</strong>
                            <div className="lines-chip-row">
                              {discard.lines.map(line => (
                                <span key={line} className="line-chip">
                                  {LINE_LABEL[line]}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="pedido-row address-row">
                            <FaMapMarkerAlt />
                            <span>{shortAddress}</span>
                          </div>
                          {discard.description && (
                            <div className="pedido-row descricao-row">
                              <strong>Descrição:</strong>
                              <span>{truncate(discard.description, 120)}</span>
                            </div>
                          )}
                        </div>

                        <footer className="pedido-card-footer">
                          <span className="created-at">
                            <FaClock /> {formatDate(discard.createdAt)}
                          </span>
                          {discard.client?.phone && (
                            <span className="pedido-phone">
                              {discard.client.phone}
                            </span>
                          )}
                        </footer>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

// Helpers

function getDiscardLatLng(discard: Discard): { lat: number | null; lng: number | null } {
  const src = discard.mode === "PICKUP" ? discard.address : discard.collectionPoint;
  const lat = src?.latitude ?? null;
  const lng = src?.longitude ?? null;
  return { lat, lng };
}

function getShortAddress(discard: Discard): string {
  const src = discard.mode === "PICKUP" ? discard.address : discard.collectionPoint;
  if (!src) return "Endereço não informado";
  const parts = [
    src.addressName,
    src.number,
    src.neighborhood,
    src.city,
    src.state,
  ].filter(Boolean);
  return parts.join(", ") || "Endereço não informado";
}

function truncate(text: string, max: number): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

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

const pedidosStyles = `
.pedidos-page {
  min-height: 100vh;
  padding: 24px 32px;
  background: radial-gradient(circle at top left, #1b3b26, #050706);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.pedidos-shell {
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

.pedidos-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.pedidos-header h1 {
  margin: 0 0 4px;
  color: #e8ffe1;
  font-size: 1.6rem;
}

.pedidos-header p {
  margin: 0;
  color: #b7d9b0;
  font-size: 0.9rem;
}

.pedidos-refresh {
  border-radius: 999px;
  padding: 8px 16px;
  background: #242624;
  color: #bde8b4;
  border: 1px solid rgba(189,232,180,0.25);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.1s ease;
}
.pedidos-refresh svg {
  font-size: 0.9rem;
}
.pedidos-refresh .spin {
  animation: spin 1s linear infinite;
}
.pedidos-refresh:hover:not(:disabled) {
  background: #2f3b30;
  transform: translateY(-1px);
}
.pedidos-refresh:disabled {
  opacity: 0.6;
  cursor: default;
}

.pedidos-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  align-items: flex-end;
  padding: 10px 12px;
  border-radius: 12px;
  background: #151915;
  border: 1px solid rgba(124,194,111,0.12);
}

.high-filter-group {
  display: flex;
  gap: 6px;
  margin-right: 10px;
}
.high-filter-btn {
  border-radius: 999px;
  padding: 5px 10px;
  border: 1px solid rgba(124,194,111,0.15);
  background: #111511;
  color: #cfe9ca;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}
.high-filter-btn.active {
  background: #7bc26f;
  color: #061006;
  border-color: #7bc26f;
}
.high-filter-btn:hover:not(.active) {
  background: #182118;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.filter-group label {
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #8ea88a;
}
.filter-group select {
  min-width: 150px;
  border-radius: 8px;
  border: 1px solid #273428;
  background: #0c100d;
  color: #f5fff3;
  padding: 6px 10px;
  font-size: 0.9rem;
  outline: none;
}

.filter-counter {
  margin-left: auto;
  font-size: 0.86rem;
  color: #bde8b4;
}

.pedidos-error {
  background: #361b1b;
  border-radius: 8px;
  border: 1px solid #ff8b8b;
  color: #ffbcbc;
  padding: 8px 10px;
  font-size: 0.86rem;
}

.pedidos-main {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1.5fr);
  gap: 20px;
  margin-top: 4px;
}

@media (max-width: 900px) {
  .pedidos-main {
    grid-template-columns: 1fr;
  }
}

.pedidos-map-wrapper {
  min-height: 380px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(124,194,111,0.2);
}

.pedidos-list-wrapper {
  background: #151915;
  border-radius: 16px;
  border: 1px solid rgba(124,194,111,0.12);
  padding: 12px 12px 10px;
  box-sizing: border-box;
}

.pedidos-empty {
  padding: 18px 10px;
  text-align: center;
  color: #a4b8a1;
  font-size: 0.9rem;
}

.pedidos-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 4px;
}

.pedido-card {
  background: #111711;
  border-radius: 12px;
  border: 1px solid rgba(124,194,111,0.18);
  padding: 8px 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pedido-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pedido-id {
  display: block;
  font-size: 0.78rem;
  color: #8ea88a;
}

.pedido-client {
  display: block;
  font-size: 0.95rem;
  color: #f5fff3;
  font-weight: 600;
}

.pedido-card-body {
  font-size: 0.86rem;
  color: #dbead6;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pedido-row {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.address-row {
  margin-top: 2px;
}
.address-row svg {
  font-size: 0.78rem;
  color: #7bc26f;
}
.address-row span {
  flex: 1;
}

.descricao-row span {
  flex: 1;
}

.pedido-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}

.pedido-phone {
  font-size: 0.8rem;
  color: #c5f2b9;
}

.lines-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.line-chip {
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(123,194,111,0.12);
  color: #c5f2b9;
  border: 1px solid rgba(123,194,111,0.4);
  font-size: 0.74rem;
}

.status-badge {
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 600;
}
.status-badge.pending {
  background: rgba(255,193,7,0.14);
  color: #ffd95a;
  border: 1px solid rgba(255,193,7,0.5);
}
.status-badge.offered {
  background: rgba(0,188,212,0.14);
  color: #6ee7f9;
  border: 1px solid rgba(0,188,212,0.5);
}
.status-badge.scheduled {
  background: rgba(76,175,80,0.18);
  color: #b2ffb5;
  border: 1px solid rgba(76,175,80,0.55);
}
.status-badge.cancelled {
  background: rgba(244,67,54,0.16);
  color: #ffb3b3;
  border: 1px solid rgba(244,67,54,0.55);
}
.status-badge.completed {
  background: rgba(120,221,120,0.16);
  color: #d8ffd8;
  border: 1px solid rgba(120,221,120,0.55);
}

.created-at {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #a4b8a1;
  font-size: 0.8rem;
}
.created-at svg {
  font-size: 0.78rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

export default Pedidos;
