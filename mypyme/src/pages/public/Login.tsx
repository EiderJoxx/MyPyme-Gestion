import React, { useState } from "react";
import Carrusel from "../../components/Carrusel";
import "../../css/Login.css";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inicio de sesión con:", { email, password });
    // Logica Autenticacion
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-header">
          <div className="logo-badge">MP</div>
          <h1 className="brand-title">MyPyme</h1>
        </div>

        <h2 className="hero-heading">
          Organiza, controla y{" "}
          <span className="highlight-text">haz crecer</span> tu negocio.
        </h2>
        <div className="carousel-wrapper">
          <Carrusel />
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <h3 className="form-title">Iniciar sesión</h3>
          <p className="form-subtitle">
            Ingresa tus credenciales para acceder al sistema
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Correo electrónico o usuario</label>
              <input
                id="email"
                type="text"
                placeholder="Ingresa tu correo electrónico o usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="........."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Iniciar sesión
            </button>

            <a href="#olvidaste" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </a>

            <div className="divider"></div>

            <button type="button" className="btn-secondary">
              Crear cuenta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div>
      <h1>Iniciar sesión</h1>
      <p>Aqui iría el formulario de inicio de sesión</p>
      <Link to="/admin" className="btn btn-primario">
        Entrar al sistemas
      </Link>
    </div>
  );
} */
