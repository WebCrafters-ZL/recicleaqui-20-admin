import React from "react";
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

const pedidos: Pedido[] = [
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
    status: "Confirmado",
    latitude: -23.564224,
    longitude: -46.651436,
  },
];

const Pedidos: React.FC = () => {
  return (
    <section className="pedidos-container">
      <h2>Pedidos de Coleta</h2>
      <div className="map-area">
        <MapContainer
          center={[-23.563987, -46.654987]}
          zoom={12}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pedidos.map((pedido) => (
            <Marker key={pedido.id} position={[pedido.latitude, pedido.longitude]}>
              <Popup>
                <strong>{pedido.nome}</strong>
                <br />
                {pedido.endereco}
                <br />
                Tipo: {pedido.tipo}
                <br />
                Status: {pedido.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="tabela-area">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Tipo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.nome}</td>
                <td>{pedido.endereco}</td>
                <td>{pedido.tipo}</td>
                <td>{pedido.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Pedidos;
