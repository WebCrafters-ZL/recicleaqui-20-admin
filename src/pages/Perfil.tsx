// src/pages/Perfil.tsx
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaEdit, FaPhoneAlt, FaBuilding } from "react-icons/fa";

const API_BASE_URL = "http://localhost:3000/api/v1";

type CollectorProfile = {
  id: number;
  name: string;
  email: string;
  cnpj?: string;
  address?: string;
  phone?: string;
};

const Perfil: React.FC = () => {
  const [userData, setUserData] = useState<CollectorProfile | null>(null);
  const [form, setForm] = useState<CollectorProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const rawUser = localStorage.getItem("loggedUser");
        const token = localStorage.getItem("token");
        if (!rawUser || !token) {
          setError("Usuário não autenticado.");
          setLoading(false);
          return;
        }

        const loggedUser = JSON.parse(rawUser);
        const collectorId: number | undefined =
          loggedUser.collectorId || loggedUser.collector_id || loggedUser.id;

        if (!collectorId) {
          setError("ID de coletor não encontrado para este usuário.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/collectors/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Erro ao carregar perfil.");
        }

        const data = await res.json();
        const profile: CollectorProfile = {
          id: data.id,
          name: data.name || data.companyName || data.tradeName || data.nome,
          email: data.email,
          cnpj: data.cnpj,
          address: data.address || data.endereco || data.headquarters?.addressName,
          phone: data.phone || data.telefone,
        };

        setUserData(profile);
        setForm(profile);
      } catch (e: any) {
        setError(e.message || "Erro ao buscar dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = async () => {
    if (!form) return;

    setSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        setSaving(false);
        return;
      }

      const body = {
        name: form.name,
        email: form.email,
        cnpj: form.cnpj,
        address: form.address,
        phone: form.phone,
      };

      const res = await fetch(`${API_BASE_URL}/collectors/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Erro ao atualizar perfil.");
      }

      const updated: CollectorProfile = {
        id: data.id || form.id,
        name: data.name || form.name,
        email: data.email || form.email,
        cnpj: data.cnpj ?? form.cnpj,
        address: data.address || data.endereco || form.address,
        phone: data.phone || data.telefone || form.phone,
      };

      setUserData(updated);
      setForm(updated);
      setEditMode(false);
      setSuccessMsg("Informações salvas com sucesso!");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (e: any) {
      setError(e.message || "Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  // loading
  if (loading) {
    return (
      <>
        <style>{perfilStyles}</style>
        <div className="perfil-page">
          <div className="perfil-card perfil-card-loading">
            <div className="perfil-skeleton avatar" />
            <div className="perfil-skeleton line" />
            <div className="perfil-skeleton line short" />
          </div>
        </div>
      </>
    );
  }

  // erro sem dados
  if (!userData || !form) {
    return (
      <>
        <style>{perfilStyles}</style>
        <div className="perfil-page">
          <div className="perfil-card">
            <p className="perfil-error-text">
              {error || "Não foi possível carregar os dados do perfil."}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{perfilStyles}</style>

      <div className="perfil-page">
        <div className="perfil-shell">
          <header className="perfil-hero">
            <div className="perfil-hero-left">
              <FaUserCircle className="perfil-hero-avatar" />
              <div>
                <h1>{userData.name || "Meu Perfil"}</h1>
                <p>{userData.email}</p>
              </div>
            </div>
            <button
              className={`perfil-edit-toggle ${editMode ? "cancel" : ""}`}
              onClick={() => setEditMode(prev => !prev)}
            >
              <FaEdit style={{ marginRight: 8 }} />
              {editMode ? "Cancelar edição" : "Editar informações"}
            </button>
          </header>

          <main className="perfil-main">
            <section className="perfil-section perfil-section-left">
              <h2>Informações principais</h2>

              <div className="perfil-grid">
                <div className="perfil-field">
                  <label>Nome da empresa</label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>

                <div className="perfil-field">
                  <label>E-mail de acesso</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>

                <div className="perfil-field">
                  <label>CNPJ</label>
                  <input
                    name="cnpj"
                    type="text"
                    value={form.cnpj || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>

                <div className="perfil-field">
                  <label>Telefone</label>
                  <div className="perfil-input-icon">
                    <FaPhoneAlt />
                    <input
                      name="phone"
                      type="text"
                      value={form.phone || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="perfil-field perfil-field-full">
                  <label>Endereço da sede</label>
                  <div className="perfil-input-icon">
                    <FaBuilding />
                    <input
                      name="address"
                      type="text"
                      value={form.address || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </div>
            </section>

            <aside className="perfil-section perfil-section-summary">
              <h2>Resumo do coletor</h2>
              <div className="perfil-summary-card">
                <div className="perfil-summary-row">
                  <span>CNPJ</span>
                  <strong>{userData.cnpj || "—"}</strong>
                </div>
                <div className="perfil-summary-row">
                  <span>Telefone</span>
                  <strong>{userData.phone || "—"}</strong>
                </div>
                <div className="perfil-summary-row">
                  <span>Endereço</span>
                  <strong>{userData.address || "—"}</strong>
                </div>
                <p className="perfil-summary-hint">
                  Essas informações são usadas pelos clientes para encontrar a
                  sua empresa e entrar em contato.
                </p>
              </div>
            </aside>
          </main>

          <footer className="perfil-footer-bar">
            {error && <span className="perfil-footer-error">{error}</span>}
            {successMsg && (
              <span className="perfil-footer-success">{successMsg}</span>
            )}

            {editMode && (
              <button
                className="perfil-save-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            )}
          </footer>
        </div>
      </div>
    </>
  );
};

const perfilStyles = `
.perfil-page {
  min-height: 100vh;
  padding: 24px 32px;
  background: radial-gradient(circle at top left, #1b3b26, #050706);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
}

.perfil-shell {
  width: 100%;
  max-width: 1100px;
  background: #101310;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(124, 194, 111, 0.18);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.perfil-hero {
  padding: 20px 28px;
  background: linear-gradient(120deg, #16351f, #254a30, #101310);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.perfil-hero-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.perfil-hero-avatar {
  font-size: 64px;
  color: #7bc26f;
}

.perfil-hero h1 {
  margin: 0 0 4px;
  color: #e8ffe1;
  font-size: 1.6rem;
}

.perfil-hero p {
  margin: 0;
  color: #b7d9b0;
  font-size: 0.9rem;
}

.perfil-edit-toggle {
  border-radius: 999px;
  padding: 8px 18px;
  background: #242624;
  color: #bde8b4;
  border: 1px solid rgba(189, 232, 180, 0.2);
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
}

.perfil-edit-toggle:hover {
  background: #2f3b30;
  transform: translateY(-1px);
}

.perfil-edit-toggle.cancel {
  background: transparent;
  color: #ffb4a2;
  border-color: rgba(255, 180, 162, 0.5);
}

.perfil-edit-toggle.cancel:hover {
  background: rgba(255, 180, 162, 0.1);
}

.perfil-main {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.2fr);
  gap: 20px;
  padding: 22px 26px 18px;
  box-sizing: border-box;
}

@media (max-width: 900px) {
  .perfil-main {
    grid-template-columns: 1fr;
  }
}

.perfil-section {
  background: #151915;
  border-radius: 14px;
  padding: 18px 18px 16px;
  border: 1px solid rgba(124, 194, 111, 0.12);
}

.perfil-section h2 {
  margin: 0 0 14px;
  font-size: 1rem;
  color: #e8ffe1;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.perfil-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
}

.perfil-field-full {
  grid-column: 1 / -1;
}

.perfil-field label {
  display: block;
  font-size: 0.8rem;
  color: #8ea88a;
  margin-bottom: 4px;
}

.perfil-field input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #273428;
  background: #0c100d;
  color: #f5fff3;
  padding: 8px 10px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  box-sizing: border-box;
}

.perfil-field input:disabled {
  background: #101510;
  color: #a4b8a1;
  cursor: default;
}

.perfil-field input:focus:not(:disabled) {
  border-color: #7bc26f;
  box-shadow: 0 0 0 1px rgba(123, 194, 111, 0.35);
}

.perfil-input-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.perfil-input-icon svg {
  color: #7bc26f;
  font-size: 0.8rem;
}

.perfil-input-icon input {
  flex: 1;
}

.perfil-section-summary {
  min-width: 0;
}

.perfil-summary-card {
  background: radial-gradient(circle at top, #182418, #101510);
  border-radius: 10px;
  padding: 14px 14px 10px;
  border: 1px solid rgba(124, 194, 111, 0.18);
}

.perfil-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.86rem;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.perfil-summary-row span {
  color: #8ea88a;
}

.perfil-summary-row strong {
  color: #f1fff0;
  font-weight: 600;
  max-width: 60%;
  text-align: right;
}

.perfil-summary-row:last-of-type {
  border-bottom: none;
}

.perfil-summary-hint {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #a0b79c;
}

.perfil-footer-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 22px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  background: #0d110d;
  box-sizing: border-box;
}

.perfil-footer-error {
  margin-right: auto;
  color: #ff8b8b;
  font-size: 0.86rem;
}

.perfil-footer-success {
  margin-right: auto;
  color: #8be68b;
  font-size: 0.86rem;
}

.perfil-save-primary {
  border-radius: 999px;
  padding: 9px 20px;
  background: #7bc26f;
  color: #061006;
  border: none;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(123, 194, 111, 0.35);
  transition: background 0.18s ease, transform 0.12s ease, box-shadow 0.18s ease;
}

.perfil-save-primary:hover:not(:disabled) {
  background: #6bb45f;
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(123, 194, 111, 0.45);
}

.perfil-save-primary:disabled {
  opacity: 0.6;
  cursor: default;
  box-shadow: none;
}

/* loading skeleton */

.perfil-card.perfil-card-loading {
  width: 100%;
  max-width: 420px;
  margin: 40px auto;
  background: #101310;
  border-radius: 16px;
  padding: 24px 22px;
  border: 1px solid rgba(124, 194, 111, 0.14);
  box-sizing: border-box;
}

.perfil-skeleton {
  background: linear-gradient(90deg, #182018, #222b22, #182018);
  background-size: 200% 100%;
  animation: perfil-shimmer 1.3s infinite;
  border-radius: 999px;
}

.perfil-skeleton.avatar {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
}

.perfil-skeleton.line {
  height: 10px;
  margin-bottom: 10px;
}

.perfil-skeleton.line.short {
  width: 60%;
  margin: 0 auto;
}

@keyframes perfil-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.perfil-error-text {
  color: #ff8b8b;
  text-align: center;
  padding: 20px 10px;
}
`;

export default Perfil;
