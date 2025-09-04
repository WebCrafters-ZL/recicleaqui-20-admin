import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

/**
 * Componente para proteger rotas, garantindo que o usuário esteja autenticado.
 * Valida token no localStorage, redireciona para /login caso usuário não esteja autenticado.
 * 
 * @param {{ children: React.ReactNode }} props
 */
const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Em produção, aqui pode-se decodificar JWT e validar expiração
    setIsAuth(token ? true : false);
  }, []);

  if (isAuth === null) {
    // Retorne loader para melhor UX
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#1b5e20",
        fontWeight: "bold",
        fontSize: "1.2rem"
      }}>
        Carregando...
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
