import React, { useState } from "react";
import "../../css/RegistrerModal.css";

interface RegistrerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrerModal: React.FC<RegistrerModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    nombreEmpresa: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    console.log("Registro con:", formData);
    // Lógica de registro backend
  };

  const handleOAuthLogin = (provider: string) => {
    console.log(`Registrando con ${provider}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
          <h2>Crear una cuenta nueva</h2>
          <p>Es rápido y sencillo para empezar a gestionar tu negocio</p>
        </div>

        <div className="Social-register-buttons">
          <button
            type="button"
            className="btn-social google"
            onClick={() => handleOAuthLogin("Google")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            Registrarse con Google
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <label htmlFor="nombreCompleto">Nombre y Apellido</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              placeholder="Ingresa tu nombre completo"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="nombreEmpresa">Nombre de la empresa</label>
            <input
              type="text"
              id="nombreEmpresa"
              name="nombreEmpresa"
              placeholder="Ingresa el nombre de tu empresa"
              value={formData.nombreEmpresa}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <p className="terms-text">
            Al registrarte, aceptas nuestros{" "}
            <a href="/terminos" target="_blank" rel="noopener noreferrer">
              Términos y condiciones
            </a>{" "}
            y nuestra{" "}
            <a href="/privacidad" target="_blank" rel="noopener noreferrer">
              Política de privacidad
            </a>
            .
          </p>

          <button type="submit" className="btn-register-submit">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrerModal;
