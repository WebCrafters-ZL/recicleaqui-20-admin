import React, { useState, useEffect } from 'react';
import '../styles/Perfil.css';
import { FaUserCircle } from 'react-icons/fa';
// 1. Importar o tipo 'FakeUser' para garantir que nossos dados estejam corretos
import { FakeUser } from '../api/fakeAuth';

const Perfil: React.FC = () => {
  // 2. Criar um estado para guardar os dados do usuário. Começa como nulo.
  const [userData, setUserData] = useState<FakeUser | null>(null);

  // 3. Usar o useEffect para buscar os dados do usuário do localStorage quando a página carregar
  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('fakeLoggedUser');
    if (loggedUserJSON) {
      setUserData(JSON.parse(loggedUserJSON));
    }
  }, []); // O array vazio [] garante que isso só rode uma vez

  // Se os dados ainda não foram carregados, mostra uma mensagem
  if (!userData) {
    return <div className="perfil-container"><h1>Carregando perfil...</h1></div>;
  }

  // 4. Se os dados foram carregados, renderiza a página com os dados dinâmicos
  return (
    <div className="perfil-container">
      <h1>Meu Perfil</h1>
      <div className="perfil-card">
        <div className="perfil-header">
          <FaUserCircle className="perfil-avatar" />
          <h2>{userData.nome}</h2>
          <p>{userData.email}</p>
        </div>
        <div className="perfil-details">
          <h3>Informações da Conta</h3>
          <div className="info-row">
            <strong>Nome Completo:</strong>
            <span>{userData.nome}</span>
          </div>
          <div className="info-row">
            <strong>Email:</strong>
            <span>{userData.email}</span>
          </div>
          <div className="info-row">
            <strong>CNPJ:</strong>
            <span>{userData.cnpj}</span>
          </div>
          <div className="info-row">
            <strong>Endereço:</strong>
            <span>{userData.endereco}</span>
          </div>
          <button className="edit-button">Editar Informações</button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;