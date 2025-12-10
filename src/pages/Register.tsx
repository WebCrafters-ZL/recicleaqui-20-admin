// pages/Register.tsx
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/Auth.css";
import logo from "../assets/logo.png";

type ForcaSenha = "fraca" | "media" | "forte";

const API_BASE_URL = "http://localhost:3000/api/v1";

function verificarSenha(senha: string): { forca: ForcaSenha; regras: any } {
  const regras = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };
  const total = Object.values(regras).filter(Boolean).length;
  let forca: ForcaSenha = "fraca";
  if (total >= 4) forca = "forte";
  else if (total === 3) forca = "media";
  return { forca, regras };
}

const PasswordStrengthBar: React.FC<{ forca: ForcaSenha }> = ({ forca }) => {
  const widthMap = { fraca: "33%", media: "66%", forte: "100%" };
  const colorMap = { fraca: "#f44336", media: "#ff9800", forte: "#4caf50" };
  const labelMap = { fraca: "Senha fraca", media: "Senha média", forte: "Senha forte" };

  return (
    <div
      style={{
        width: "100%",
        margin: "12px 0 2px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          height: 8,
          width: "100%",
          backgroundColor: "#ddd",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: widthMap[forca],
            backgroundColor: colorMap[forca],
            borderRadius: 5,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span
        style={{
          color: colorMap[forca],
          fontWeight: 600,
          fontSize: 14,
          margin: "4px 0 0 0",
        }}
      >
        {labelMap[forca]}
      </span>
    </div>
  );
};

const formatCNPJ = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
};

const normalizeCEP = (value: string) => value.replace(/\D/g, "").slice(0, 8);

const Register: React.FC = () => {
  const [form, setForm] = useState({
    cnpj: "",
    nome: "",
    addressName: "",
    number: "",
    neighborhood: "",
    postalCode: "",
    city: "",
    state: "",
    email: "",
    telefone: "",
    senha: "",
    confirmar: "",
  });
  const [error, setError] = useState("");
  const [loadingCNPJ, setLoadingCNPJ] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaConfirmar, setMostrarSenhaConfirmar] = useState(false);
  const [mostrarRegras, setMostrarRegras] = useState(false);
  const [loading, setLoading] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const {
    cnpj,
    nome,
    addressName,
    number,
    neighborhood,
    postalCode,
    city,
    state,
    email,
    telefone,
    senha,
    confirmar,
  } = form;
  const { forca, regras } = verificarSenha(senha);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cnpj") {
      setForm(prev => ({ ...prev, cnpj: formatCNPJ(value) }));
    } else if (name === "postalCode") {
      setForm(prev => ({ ...prev, postalCode: normalizeCEP(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleCNPJBlur = async () => {
    const rawCNPJ = cnpj.replace(/\D/g, "");
    if (!rawCNPJ) return;
    if (rawCNPJ.length !== 14) {
      setError("CNPJ inválido");
      return;
    }

    setLoadingCNPJ(true);
    setError("");

    try {
      const res = await fetch(`https://cnpj.ws/cnpj/${rawCNPJ}`);
      const data = await res.json();
      if (data.error) {
        setError("CNPJ não encontrado.");
      } else {
        const est = data.estabelecimento || {};
        const cepLimpo = normalizeCEP(est.cep || "");
        setForm(prev => ({
          ...prev,
          nome: data.razao_social || prev.nome,
          addressName: est.logradouro || prev.addressName,
          number: (est.numero || prev.number || "").toString(),
          neighborhood: est.bairro || prev.neighborhood,
          postalCode: cepLimpo || prev.postalCode,
          city: est.cidade?.nome || prev.city,
          state: est.estado?.sigla || prev.state,
        }));
      }
    } catch {
      setError("Erro ao consultar CNPJ.");
    } finally {
      setLoadingCNPJ(false);
    }
  };

  const handleFocus = () => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
    setMostrarRegras(true);
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => {
      setMostrarRegras(false);
    }, 300);
  };

  const handleCepLookup = async () => {
    const cepLimpo = normalizeCEP(postalCode);
    if (!cepLimpo || cepLimpo.length !== 8) {
      setError("Informe um CEP válido com 8 dígitos.");
      return;
    }

    setLoadingCEP(true);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`);
      if (!res.ok) {
        throw new Error("CEP não encontrado");
      }
      const data = await res.json();

      setForm(prev => ({
        ...prev,
        postalCode: cepLimpo,
        addressName: data.street || prev.addressName,
        neighborhood: data.neighborhood || prev.neighborhood,
        city: data.city || prev.city,
        state: data.state || prev.state,
      }));
      setError("");
    } catch (err) {
      console.error("Erro ao buscar CEP BrasilAPI:", err);
      setError("CEP não encontrado na BrasilAPI.");
    } finally {
      setLoadingCEP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !cnpj ||
      !nome ||
      !addressName ||
      !number ||
      !neighborhood ||
      !postalCode ||
      !city ||
      !state ||
      !email ||
      !telefone ||
      !senha ||
      !confirmar
    ) {
      setError("Preencha todos os campos");
      return;
    }
    const cepLimpo = normalizeCEP(postalCode);
    if (cepLimpo.length !== 8) {
      setError("CEP deve ter 8 dígitos");
      return;
    }
    if (senha !== confirmar) {
      setError("Senhas não coincidem");
      return;
    }
    if (!regras.tamanho || !regras.maiuscula || !regras.especial) {
      setError("Senha não atende aos requisitos");
      return;
    }

    try {
      setLoading(true);
      const rawCNPJ = cnpj.replace(/\D/g, "");

      const enderecoBase = {
        addressName: addressName.trim(),
        number: number.trim(),
        additionalInfo: "",
        neighborhood: neighborhood.trim(),
        postalCode: cepLimpo,
        city: city.trim(),
        state: state.trim(),
        latitude: null as number | null,
        longitude: null as number | null,
      };

      // ponto de coleta padrão baseado na sede
      const defaultPoint = {
        name: `${nome.trim()} - Sede`,
        description: "Ponto de coleta principal cadastrado automaticamente.",
        ...enderecoBase,
        operatingHours: "",
        acceptedLines: [] as string[],
        isActive: true,
      };

      const payload = {
        companyName: nome.trim(),
        tradeName: nome.trim(),
        cnpj: rawCNPJ,
        phone: telefone.trim(),
        description: "",
        operatingHours: "",
        collectionType: "BOTH",
        acceptedLines: [] as string[],

        // campos obrigatórios já validados pelo serviço
        email: email.trim(),
        password: senha,

        headquarters: enderecoBase,

        // garante pelo menos um ponto de coleta para não quebrar a validação
        collectionPoints: [defaultPoint],
      };

      const res = await fetch(`${API_BASE_URL}/collectors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = {};
      try {
        if (text) data = JSON.parse(text);
      } catch {
        console.error("Resposta não é JSON parseável:", text);
      }

      setLoading(false);

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          "Erro ao cadastrar coletor. Verifique os dados informados.";
        setError(msg);
        console.error("Erro cadastro coletor:", msg, "status:", res.status, "body:", data);
        return;
      }

      alert("Cadastro realizado com sucesso! Faça login.");
      navigate("/login");
    } catch (err) {
      console.error("Erro ao conectar ao backend:", err);
      setLoading(false);
      setError("Erro ao conectar ao servidor. Verifique se o backend está rodando.");
    }
  };

  return (
    <div className="auth-bg">
      <div className="unified-card">
        <div className="unified-logo">
          <img src={logo} alt="RecicleAqui Logo" />
        </div>
        <div className="unified-form">
          <h2>Cadastro Empresa Coletora</h2>
          <form onSubmit={handleSubmit} noValidate>
            <input
              name="cnpj"
              type="text"
              placeholder="CNPJ"
              value={cnpj}
              onChange={handleChange}
              onBlur={handleCNPJBlur}
              autoComplete="off"
              maxLength={18}
              required
              disabled={loading}
            />
            {loadingCNPJ && (
              <div style={{ color: "#7bc26f", marginBottom: 8 }}>
                Consultando dados do CNPJ...
              </div>
            )}
            <input
              name="nome"
              type="text"
              placeholder="Nome da empresa"
              value={nome}
              onChange={handleChange}
              autoComplete="off"
              required
              style={{ backgroundColor: "#eafbe2" }}
              disabled={loading}
            />
            <input
              name="telefone"
              type="text"
              placeholder="Telefone"
              value={telefone}
              onChange={handleChange}
              autoComplete="off"
              required
              disabled={loading}
            />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                name="postalCode"
                type="text"
                placeholder="CEP"
                value={postalCode}
                onChange={handleChange}
                onBlur={handleCepLookup}
                autoComplete="off"
                required
                maxLength={8}
                style={{ flex: 1, backgroundColor: "#eafbe2" }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleCepLookup}
                disabled={loading || loadingCEP}
                style={{
                  padding: "10px 12px",
                  background: "#7bc26f",
                  color: "#0d0f0d",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 700,
                  minWidth: 120,
                }}
              >
                {loadingCEP ? "Buscando..." : "Buscar CEP"}
              </button>
            </div>
            <input
              name="addressName"
              type="text"
              placeholder="Logradouro"
              value={addressName}
              onChange={handleChange}
              autoComplete="off"
              required
              style={{ backgroundColor: "#eafbe2" }}
              disabled={loading}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <input
                name="number"
                type="text"
                placeholder="Número"
                value={number}
                onChange={handleChange}
                autoComplete="off"
                required
                style={{ backgroundColor: "#eafbe2" }}
                disabled={loading}
              />
              <input
                name="neighborhood"
                type="text"
                placeholder="Bairro"
                value={neighborhood}
                onChange={handleChange}
                autoComplete="off"
                required
                style={{ backgroundColor: "#eafbe2" }}
                disabled={loading}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                name="city"
                type="text"
                placeholder="Cidade"
                value={city}
                onChange={handleChange}
                autoComplete="off"
                required
                style={{ backgroundColor: "#eafbe2" }}
                disabled={loading}
              />
              <input
                name="state"
                type="text"
                placeholder="Estado"
                value={state}
                onChange={handleChange}
                autoComplete="off"
                required
                maxLength={2}
                style={{ backgroundColor: "#eafbe2" }}
                disabled={loading}
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email de acesso"
              value={email}
              onChange={handleChange}
              autoComplete="off"
              required
              disabled={loading}
            />
            <div style={{ position: "relative" }}>
              <input
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(prev => !prev)}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#7bc26f",
                  fontWeight: "bold",
                }}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
              {mostrarRegras && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "110%",
                    background: "#242624",
                    borderRadius: 8,
                    padding: "15px",
                    color: "#bde8b4",
                    fontSize: 14,
                    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                    zIndex: 1000,
                  }}
                >
                  <strong>Sua senha deve conter:</strong>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 20,
                      listStyleType: "disc",
                    }}
                  >
                    <li style={{ color: regras.maiuscula ? "#7bc26f" : "#444" }}>
                      Uma letra maiúscula
                    </li>
                    <li style={{ color: regras.minuscula ? "#7bc26f" : "#444" }}>
                      Uma letra minúscula
                    </li>
                    <li style={{ color: regras.numero ? "#7bc26f" : "#444" }}>
                      Um número
                    </li>
                    <li style={{ color: regras.especial ? "#7bc26f" : "#444" }}>
                      Um caractere especial
                    </li>
                    <li style={{ color: regras.tamanho ? "#7bc26f" : "#444" }}>
                      Mínimo 8 caracteres
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <input
                name="confirmar"
                type={mostrarSenhaConfirmar ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirmar}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setMostrarSenhaConfirmar(prev => !prev)}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#7bc26f",
                  fontWeight: "bold",
                }}
                aria-label={
                  mostrarSenhaConfirmar ? "Ocultar senha" : "Mostrar senha"
                }
              >
                {mostrarSenhaConfirmar ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <PasswordStrengthBar forca={forca} />
            {error && <div className="error-message">{error}</div>}
            <Button
              label={loading ? "Cadastrando..." : "Cadastrar"}
              type="submit"
              disabled={loading}
            />
          </form>
          <div className="form-links">
            Já possui cadastro? <Link to="/login">Faça login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
