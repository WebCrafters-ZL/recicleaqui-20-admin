import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Exemplo de verificação de autenticação baseada em token/localStorage
const isAuthenticated = () => {
  // Substitua pelo seu método real de autenticação
  return !!localStorage.getItem("token");
};

const ProtectedRoutes: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
