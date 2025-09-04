import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PasswordStrengthBar from '../components/PasswordStrengthBar';
import Button from '../components/Button';
import '../styles/Auth.css';

function validatePassword(pw) {
  return (
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /\d/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw)
  );
}

const Register = () => {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const [error, setError] = useState('');
  const { nome, email, senha, confirmar } = form;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!nome || !email || !senha || !confirmar) {
      setError('Preencha todos os campos');
    } else if (senha !== confirmar) {
      setError('Senhas não coincidem');
    } else if (!validatePassword(senha)) {
      setError('Senha fraca: mínimo 8 caracteres, um maiúsculo, um número, um especial');
    } else {
      // Implementar ação de registro (ex: API)
      alert('Cadastro realizado com sucesso!');
      // Redirecionar para login (exemplo nesse código, use navigate se quiser)
    }
  }

  return (
    <div className="auth-bg">
      <div className="form-card">
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <input name="nome" type="text" placeholder="Nome completo" value={nome} onChange={handleChange} autoComplete="off" />
          <input name="email" type="email" placeholder="Email" value={email} onChange={handleChange} autoComplete="off" />
          <input name="senha" type="password" placeholder="Senha" value={senha} onChange={handleChange} />
          <PasswordStrengthBar password={senha} />
          <input name="confirmar" type="password" placeholder="Confirmar senha" value={confirmar} onChange={handleChange} />
          {error && <div className="error-message">{error}</div>}
          <Button label="Cadastrar" variant="primary" type="submit" />
        </form>
        <div className="form-links">
          Já possui cadastro? <Link to="/login">Faça login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
