import React from "react";
import { useNavigate } from "react-router-dom";
import { fakeLogout } from "../api/fakeAuth";

const HomeUsuario: React.FC = () => {
  const navigate = useNavigate();

  function handleLogout() {
    fakeLogout();
    navigate("/login");
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Bem-vindo à Home do Usuário!</h2>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default HomeUsuario;
