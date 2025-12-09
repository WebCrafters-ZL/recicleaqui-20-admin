import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomeUsuario from "../pages/HomeUsuario";
import Historico from "../pages/Historico";
import Faturamento from "../pages/Faturamento";
import Pedidos from "../pages/Pedidos";
import Dashboard from "../pages/Dashboard";
import Perfil from "../pages/Perfil";
import ProtectedRoutes from "./ProtectedRoutes"; 

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/cadastro" element={<Register />} />

    {/* Protege todas rotas abaixo */}
    <Route element={<ProtectedRoutes />}>
      <Route path="/homeusuario" element={<HomeUsuario />}>
        <Route index element={<Dashboard />} />
        <Route path="historico" element={<Historico />} />
        <Route path="faturamento" element={<Faturamento />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
