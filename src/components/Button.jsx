import React from "react";
import "../styles/Button.css";

const Button = ({ label, variant, ...props }) => (
  <button className={`custom-btn ${variant || "primary"}`} {...props}>
    {label}
  </button>
);

export default Button;
