import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomeUsuario from "../pages/HomeUsuario";
import Historico from "../pages/Historico";
import Faturamento from "../pages/Faturamento";

import Pedidos from "../pages/Pedidos";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/cadastro" element={<Register />} />
    <Route path="/homeusuario" element={<HomeUsuario />}>
    <Route path="historico" element={<Historico />} />
      <Route path="faturamento" element={<Faturamento />} />
    
      <Route path="pedidos" element={<Pedidos />} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
