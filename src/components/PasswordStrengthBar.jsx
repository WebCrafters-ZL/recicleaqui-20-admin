import React from 'react';
import '../styles/PasswordStrengthBar.css';

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLabels = ["Muito Fraca", "Fraca", "Média", "Forte", "Excelente"];

const PasswordStrengthBar = ({ password }) => {
  const score = getStrength(password);
  return (
    <div className="strength-bar">
      <div className={`bar bar-${score}`} style={{ width: `${score * 25}%` }} />
      <span className={`strength-label label-${score}`}>
        {strengthLabels[score] || "Muito Fraca"}
      </span>
    </div>
  );
};

export default PasswordStrengthBar;
