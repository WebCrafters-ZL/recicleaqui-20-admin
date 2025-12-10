// pages/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/Auth.css";
import logo from "../assets/logo.png";
import { loginApi } from "../api/authApi";

const Login: React.FC = () => {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, senha } = form;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    const res = await loginApi(email, senha);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
      return;
    }

    alert(res.message);
    navigate("/homeusuario");
  };

  return (
    <div className="auth-bg">
      <div className="unified-card">
        <div className="unified-logo">
          <img src={logo} alt="RecicleAqui Logo" />
        </div>
        <div className="unified-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} noValidate>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              autoComplete="off"
              required
              disabled={loading}
            />
            <input
              name="senha"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={handleChange}
              autoComplete="off"
              required
              disabled={loading}
            />
            {error && (
              <div className="error-message">{error}</div>
            )}
            <Button
              label={loading ? "Entrando..." : "Entrar"}
              type="submit"
              disabled={loading}
            />
          </form>
          <div className="form-links">
            Não possui cadastro? <Link to="/cadastro">Cadastre-se</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
