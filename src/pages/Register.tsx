import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import "../styles/Auth.css";
import logo from "../assets/logo.png";

type ForcaSenha = "fraca" | "media" | "forte";

function verificarForcaSenha(senha: string): { forca: ForcaSenha; regras: any } {
  const regras = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };
  const totalRegras = Object.values(regras).filter(Boolean).length;
  let forca: ForcaSenha = "fraca";
  if (totalRegras >= 4) forca = "forte";
  else if (totalRegras === 3) forca = "media";
  return { forca, regras };
}

const PasswordStrengthBar: React.FC<{ forca: ForcaSenha }> = ({ forca }) => {
  const widthMap = { fraca: "33%", media: "66%", forte: "100%" };
  const colorMap = { fraca: "#f44336", media: "#ff9800", forte: "#4caf50" };
  const labelMap = { fraca: "Senha fraca", media: "Senha média", forte: "Senha forte" };

  return (
    <div style={{ width: "100%", marginTop: 8, marginBottom: 10, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ height: 8, width: "100%", backgroundColor: "#ddd", borderRadius: 5, overflow: "hidden" }}>
        <div style={{ height: "100%", width: widthMap[forca], backgroundColor: colorMap[forca], borderRadius: 5, transition: "width 0.3s ease" }}/>
      </div>
      <span style={{ color: colorMap[forca], fontWeight: 600, fontSize: 14 }}>{labelMap[forca]}</span>
    </div>
  );
};

const Register: React.FC = () => {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [error, setError] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaConfirmar, setMostrarSenhaConfirmar] = useState(false);
  const [mostrarRegras, setMostrarRegras] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { nome, email, senha, confirmar } = form;
  const { forca, regras } = verificarForcaSenha(senha);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !email || !senha || !confirmar) {
      setError("Preencha todos os campos");
    } else if (senha !== confirmar) {
      setError("Senhas não coincidem");
    } else if (!regras.tamanho || !regras.maiuscula || !regras.especial) {
      setError("Senha não corresponde às orientações");
    } else {
      alert("Cadastro realizado com sucesso!");
    }
  }

  function handleFocus() {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
    setMostrarRegras(true);
  }

  function handleBlur() {
    blurTimeout.current = setTimeout(() => {
      setMostrarRegras(false);
    }, 300);
  }

  return (
    <div className="auth-bg">
      <div className="unified-card" style={{ minWidth: 700, maxWidth: 780, minHeight: 430 }}>
        <div className="unified-logo" style={{ width: 340, height: 430, backgroundColor: "rgba(15,15,15,0.97)", borderRight: "1.5px solid #18422955", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src={logo} alt="RecicleAqui Logo" style={{ maxWidth: 140, maxHeight: 150, objectFit: "contain", userSelect: "none" }} />
        </div>
        <div className="unified-form" style={{ padding: "40px 32px 32px 32px", color: "#e7ffec", width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h2 style={{ fontWeight: 700, marginBottom: 14, fontSize: 24, color: "#a3d18b" }}>Cadastro</h2>
          <form onSubmit={handleSubmit} noValidate style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <input name="nome" type="text" placeholder="Nome completo" value={nome} onChange={handleChange} autoComplete="off" required style={{
              width:"100%", marginBottom:12, borderRadius:8, border:"1.5px solid #264c38", padding:"12px 18px", fontSize:16, backgroundColor:"#dff0d8", color:"#194619", outline:"none", boxSizing:"border-box"
            }} />
            <input name="email" type="email" placeholder="Email" value={email} onChange={handleChange} autoComplete="off" required style={{
              width:"100%", marginBottom:12, borderRadius:8, border:"1.5px solid #264c38", padding:"12px 18px", fontSize:16, backgroundColor:"#dff0d8", color:"#194619", outline:"none", boxSizing:"border-box"
            }} />

            <div style={{ width: "100%", position: "relative", marginBottom: 12 }}>
              <input name="senha" type={mostrarSenha ? "text" : "password"} placeholder="Senha" value={senha} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required style={{ width:"100%", marginBottom:0, borderRadius:8, border:"1.5px solid #264c38", padding:"12px 50px 12px 18px", fontSize:16, backgroundColor:"#dff0d8", color:"#194619", outline:"none", boxSizing:"border-box" }} />
              <button type="button" onClick={() => setMostrarSenha(v => !v)} style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#7bc26f", cursor: "pointer", fontWeight: "bold", fontSize: "0.98rem", padding: 0 }} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}>{mostrarSenha ? "Ocultar" : "Mostrar"}</button>
              {mostrarRegras && (
                <div style={{
                  position: "absolute",
                  left: 0, // Alterado de "105%" para 0
                  top: "110%", // Alterado de 0 para "110%" para aparecer abaixo do input
                  zIndex: 10,
                  minWidth: 240,
                  background: "#242624",
                  color: "#bde0b8",
                  borderRadius: 8,
                  boxShadow: "0 2px 16px #18351f88",
                  padding: "18px 18px 14px 18px",
                  fontSize: 15,
                  fontWeight: 500,
                  userSelect: "none"
                }}>
                  <p style={{ marginBottom: 8, color: "#bde0b8", fontWeight: 700 }}>SUA SENHA DEVE CONTER:</p>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li style={{ color: regras.maiuscula ? "#7bc26f" : "#666" }}>Uma letra maiúscula</li>
                    <li style={{ color: regras.minuscula ? "#7bc26f" : "#666" }}>Uma letra minúscula</li>
                    <li style={{ color: regras.numero ? "#7bc26f" : "#666" }}>Um número</li>
                    <li style={{ color: regras.especial ? "#7bc26f" : "#666" }}>Um caractere especial</li>
                    <li style={{ color: regras.tamanho ? "#7bc26f" : "#666" }}>Mínimo 8 caracteres</li>
                  </ul>
                </div>
              )}
            </div>

            <PasswordStrengthBar forca={forca} />

            <div style={{ width: "100%", position: "relative", marginBottom: 12 }}>
              <input name="confirmar" type={mostrarSenhaConfirmar ? "text" : "password"} placeholder="Confirmar senha" value={confirmar} onChange={handleChange} required style={{ width: "100%", marginBottom: 0, borderRadius: 8, border: "1.5px solid #264c38", padding: "12px 50px 12px 18px", fontSize: 16, backgroundColor: "#dff0d8", color: "#194619", outline: "none", boxSizing: "border-box" }} />
              <button type="button" onClick={() => setMostrarSenhaConfirmar(v => !v)} style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#7bc26f", cursor: "pointer", fontWeight: "bold", fontSize: "0.98rem", padding: 0 }} aria-label={mostrarSenhaConfirmar ? "Ocultar senha" : "Mostrar senha"}>{mostrarSenhaConfirmar ? "Ocultar" : "Mostrar"}</button>
            </div>

            {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

            <Button label="Cadastrar" variant="primary" type="submit" style={{ width: "100%", marginTop: 8 }} />
          </form>
          <div style={{ marginTop: 12, fontSize: 16, color: "#bde0b8" }}>
            Já possui cadastro? <Link to="/login">Faça login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
