import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* Rota pública */}
    <Route path="/login" element={<Login />} />
    <Route path="/cadastro" element={<Register />} />
    {/* Rota protegida */}
    <Route 
      path="/" 
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } 
    />
    {/* Redirecionamento padrão */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
