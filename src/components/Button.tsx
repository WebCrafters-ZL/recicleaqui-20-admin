import React from "react";
import "../styles/Button.css";

// Definindo o tipo das props com interface
interface ButtonProps {
  label: string;
  variant?: string;
  // Pode adicionar outras props que quiser passar para o botão
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({ label, variant, ...props }) => (
  <button className={`custom-btn ${variant || "primary"}`} {...props}>
    {label}
  </button>
);

export default Button;
