import React, { useState, useEffect } from 'react';
import '../styles/Perfil.css';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { FakeUser } from '../api/fakeAuth';

const Perfil: React.FC = () => {
  const [userData, setUserData] = useState<FakeUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<FakeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('fakeLoggedUser');
    if (loggedUserJSON) {
      setUserData(JSON.parse(loggedUserJSON));
      setForm(JSON.parse(loggedUserJSON));
    }
    setLoading(false);
  }, []);

  if (loading || !userData) {
    return (
      <div className="perfil-container">
        <h1>Carregando perfil...</h1>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form) return;
    localStorage.setItem("fakeLoggedUser", JSON.stringify(form));
    setUserData(form);
    setSuccessMsg("Informações salvas com sucesso!");
    setEditMode(false);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  return (
    <div className="perfil-container">
      <h1 style={{ fontSize: "2.2rem", marginBottom: "1.5rem" }}>Meu Perfil</h1>
      <div className="perfil-card" style={{ maxWidth: 450, margin: "auto", boxShadow: "0 4px 20px #0001", borderRadius: 16, padding: 28 }}>
        <div className="perfil-header" style={{ textAlign: "center", marginBottom: 24 }}>
          <FaUserCircle className="perfil-avatar" style={{ fontSize: 80, color: "#7bc26f" }} />
          <h2 style={{ margin: "15px 0 5px 0", fontWeight: 600 }}>
            {editMode ? (
              <input name="nome" value={form?.nome || ""} onChange={handleChange} className="edit-input" />
            ) : (
              userData.nome
            )}
          </h2>
          <p style={{ color: "#777", fontSize: 16 }}>
            {editMode ? (
              <input name="email" value={form?.email || ""} onChange={handleChange} className="edit-input" />
            ) : (
              userData.email
            )}
          </p>
        </div>
        <div className="perfil-details">
          <h3 style={{ marginBottom: 16, fontWeight: "500", fontSize: 18 }}>Informações da Conta</h3>
          <div className="info-row"><strong>Nome Completo:</strong>
            {editMode ? (
              <input name="nome" value={form?.nome || ""} onChange={handleChange} className="edit-input"/>
            ) : (
              <span>{userData.nome}</span>
            )}
          </div>
          <div className="info-row"><strong>Email:</strong>
            {editMode ? (
              <input name="email" value={form?.email || ""} onChange={handleChange} className="edit-input"/>
            ) : (
              <span>{userData.email}</span>
            )}
          </div>
          <div className="info-row"><strong>CNPJ:</strong>
            {editMode ? (
              <input name="cnpj" value={form?.cnpj || ""} onChange={handleChange} className="edit-input"/>
            ) : (
              <span>{userData.cnpj}</span>
            )}
          </div>
          <div className="info-row"><strong>Endereço:</strong>
            {editMode ? (
              <input name="endereco" value={form?.endereco || ""} onChange={handleChange} className="edit-input"/>
            ) : (
              <span>{userData.endereco}</span>
            )}
          </div>
          <div style={{ marginTop: "1.2rem", textAlign: "right" }}>
            {editMode ? (
              <>
                <button className="save-button" style={{marginRight:10, background: "#7bc26f", color: "#fff", borderRadius:8}}
                  onClick={handleSave}>Salvar</button>
                <button className="cancel-button" style={{background: "#eee", borderRadius:8}}
                  onClick={() => setEditMode(false)}>Cancelar</button>
              </>
            ) : (
              <button className="edit-button"
                style={{ background: "#242624", color: "#bde8b4", borderRadius: 8, padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}
                onClick={() => setEditMode(true)}>
                <FaEdit style={{ marginRight: 5 }} />
                Editar Informações
              </button>
            )}
          </div>
          {successMsg && <div className="success-msg" style={{ color: "#37b54a", paddingTop: 12 }}>{successMsg}</div>}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
