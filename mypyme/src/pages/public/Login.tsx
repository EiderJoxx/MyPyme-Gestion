import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { RUTA_INICIAL } from "../../auth/permisos";

export default function Login() {
  const { usuario, usuarios, iniciarSesion, configurarAdministrador } =
    useAuth();
  const [nombre, setNombre] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const primeraVez = usuarios.length === 0;

  // Si ya hay sesión (o se acaba de iniciar), va directo a su pantalla
  if (usuario) return <Navigate to={RUTA_INICIAL[usuario.rol]} replace />;

  async function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (primeraVez && clave !== confirmar)
      return setError("Las contraseñas no coinciden");

    setEnviando(true);
    const resultado = primeraVez
      ? await configurarAdministrador({ nombre, usuario: nombreUsuario, clave })
      : await iniciarSesion(nombreUsuario, clave);
    setEnviando(false);
    if (!resultado.ok) setError(resultado.error);
  }

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <div className="card shadow-sm">
        <form
          onSubmit={alEnviar}
          className="card-body p-4 d-flex flex-column gap-3"
        >
          <div>
            <h1 className="h4 mb-1">
              {primeraVez ? "Configura tu sistema" : "Iniciar sesión"}
            </h1>
            <p className="text-secondary small mb-0">
              {primeraVez
                ? "Todavía no hay usuarios. Crea la cuenta del administrador."
                : "Ingresa con tu usuario y contraseña."}
            </p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 mb-0" role="alert">
              {error}
            </div>
          )}

          {primeraVez && (
            <div>
              <label htmlFor="login-nombre" className="form-label">
                Nombre completo
              </label>
              <input
                id="login-nombre"
                className="form-control"
                value={nombre}
                autoComplete="name"
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          )}

          <div>
            <label htmlFor="login-usuario" className="form-label">
              Usuario
            </label>
            <input
              id="login-usuario"
              className="form-control"
              value={nombreUsuario}
              autoComplete="username"
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="login-clave" className="form-label">
              Contraseña
            </label>
            <input
              id="login-clave"
              type="password"
              className="form-control"
              value={clave}
              autoComplete={primeraVez ? "new-password" : "current-password"}
              onChange={(e) => setClave(e.target.value)}
            />
          </div>

          {primeraVez && (
            <div>
              <label htmlFor="login-confirmar" className="form-label">
                Confirmar contraseña
              </label>
              <input
                id="login-confirmar"
                type="password"
                className="form-control"
                value={confirmar}
                autoComplete="new-password"
                onChange={(e) => setConfirmar(e.target.value)}
              />
              <small className="text-secondary">Mínimo 8 caracteres.</small>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {enviando
              ? "Verificando..."
              : primeraVez
                ? "Crear administrador y entrar"
                : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* import React, { useState } from "react";
import Carrusel from "../../components/Carrusel";
import "../../css/Login.css";
import RegistrerModal from "../../components/auth/RegisterModal";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsRegisterOpen(true)}
            >
              Crear cuenta
            </button>
          </form>
        </div>
      </div>
      <RegistrerModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
};

export default Login;
 */
