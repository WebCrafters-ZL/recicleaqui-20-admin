import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/Auth.css';
import logo from '../assets/logo.png';

const Login = () => {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const { email, senha } = form;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !senha) {
      setError('Preencha todos os campos');
    } else {
      alert('Login realizado com sucesso!');
    }
  }

  return (
    <div className="auth-bg">
      <div className="unified-card">
        <div className="unified-logo">
          <img src={logo} alt="RecicleAqui Logo" />
        </div>
        <div className="unified-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              autoComplete="off"
            />
            <input
              name="senha"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={handleChange}
            />
            {error && <div className="error-message">{error}</div>}
            <Button label="Entrar" variant="primary" type="submit" />
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
