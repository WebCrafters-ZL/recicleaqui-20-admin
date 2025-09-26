import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomeUsuario from "../pages/HomeUsuario";
import Historico from "../pages/Historico";
import Faturamento from "../pages/Faturamento";
import Pedidos from "../pages/Pedidos";
import Dashboard from "../pages/Dashboard"; // 1. IMPORTAR O NOVO COMPONENTE

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/cadastro" element={<Register />} />

    {/* Esta é a rota "pai" que mostra a Sidebar */}
    <Route path="/homeusuario" element={<HomeUsuario />}>
      
      {/* 2. A ROTA "INDEX" É A CORREÇÃO PRINCIPAL */}
      {/* Ela diz ao React: "Quando o usuário estiver em /homeusuario, mostre este componente" */}
      <Route index element={<Dashboard />} />
      
      {/* As outras páginas continuam como sub-rotas */}
      <Route path="historico" element={<Historico />} />
      <Route path="faturamento" element={<Faturamento />} />
      <Route path="pedidos" element={<Pedidos />} />
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;