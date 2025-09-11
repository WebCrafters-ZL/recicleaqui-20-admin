import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/Auth.css";
import logo from "../assets/logo.png";
import { fakeRegister } from "../api/fakeAuth";

type ForcaSenha = "fraca" | "media" | "forte";

function verificarSenha(senha: string): { forca: ForcaSenha; regras: any } {
  const regras = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha)
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
    <div style={{ width: '100%', margin: "12px 0 2px 0", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ height: 8, width: "100%", backgroundColor: "#ddd", borderRadius: 5, overflow: 'hidden' }}>
        <div style={{ height: "100%", width: widthMap[forca], backgroundColor: colorMap[forca], borderRadius: 5, transition: "width 0.3s ease" }} />
      </div>
      <span style={{ color: colorMap[forca], fontWeight: 600, fontSize: 14, margin: "4px 0 0 0" }}>{labelMap[forca]}</span>
    </div>
  );
};

const Register: React.FC = () => {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [error, setError] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaConfirmar, setMostrarSenhaConfirmar] = useState(false);
  const [mostrarRegras, setMostrarRegras] = useState(false);
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const { nome, email, senha, confirmar } = form;
  const { forca, regras } = verificarSenha(senha);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha || !confirmar) {
      setError("Preencha todos os campos");
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
    const res = fakeRegister({ nome, email, senha });
    if (!res.success) {
      setError(res.message);
      return;
    }
    alert(res.message);
    navigate("/login");
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

  return (
    <div className="auth-bg">
      <div className="unified-card">
        <div className="unified-logo">
          <img src={logo} alt="RecicleAqui Logo" />
        </div>
        <div className="unified-form">
          <h2>Cadastro</h2>
          <form onSubmit={handleSubmit} noValidate>
            <input
              name="nome"
              type="text"
              placeholder="Nome completo"
              value={form.nome}
              onChange={handleChange}
              autoComplete="off"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />
            <div style={{ position: 'relative' }}>
              <input
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
                value={form.senha}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7bc26f',
                  fontWeight: 'bold'
                }}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
              {mostrarRegras && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '110%',
                  background: '#242624',
                  borderRadius: 8,
                  padding: '15px',
                  color: '#bde8b4',
                  fontSize: 14,
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                  zIndex: 1000
                }}>
                  <strong>Sua senha deve conter:</strong>
                  <ul style={{ margin: 0, paddingLeft: 20, listStyleType: 'disc' }}>
                    <li style={{ color: regras.maiuscula ? '#7bc26f' : '#444' }}>Uma letra maiúscula</li>
                    <li style={{ color: regras.minuscula ? '#7bc26f' : '#444' }}>Uma letra minúscula</li>
                    <li style={{ color: regras.numero ? '#7bc26f' : '#444' }}>Um número</li>
                    <li style={{ color: regras.especial ? '#7bc26f' : '#444' }}>Um caractere especial</li>
                    <li style={{ color: regras.tamanho ? '#7bc26f' : '#444' }}>Mínimo 8 caracteres</li>
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
              />
              <button
                type="button"
                onClick={() => setMostrarSenhaConfirmar(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7bc26f',
                  fontWeight: 'bold'
                }}
                aria-label={mostrarSenhaConfirmar ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenhaConfirmar ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <PasswordStrengthBar forca={forca} />
            {error && <div className="error-message">{error}</div>}
            <Button label="Cadastrar" type="submit" />
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
