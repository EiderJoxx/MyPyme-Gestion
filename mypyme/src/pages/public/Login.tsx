import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { RUTA_INICIAL } from "../../auth/permisos";
import "../../css/Login.css";

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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

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
    <div className="login-wrapper">
      <div className="login-card">
        <form
          onSubmit={alEnviar}
          className="p-4 p-md-5 d-flex flex-column gap-3"
        >
          <div className="text-center mb-2">
            <h1 className="login-title h3 mb-2">
              {primeraVez ? "Configura tu sistema" : "Iniciar sesión"}
            </h1>
            <p className="login-subtitle mb-0">
              {primeraVez
                ? "Todavía no hay usuarios. Crea la cuenta del administrador."
                : "Ingresa con tu usuario y contraseña."}
            </p>
          </div>

          {error && (
            <div
              className="alert alert-danger py-2 mb-0 text-center"
              role="alert"
            >
              {error}
            </div>
          )}

          {primeraVez && (
            <div>
              <label
                htmlFor="login-nombre"
                className="form-label fw-semibold text-secondary small"
              >
                Nombre completo
              </label>
              <input
                id="login-nombre"
                className="form-control login-input"
                value={nombre}
                autoComplete="name"
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Juan Pérez"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="login-usuario"
              className="form-label fw-semibold text-secondary small"
            >
              Usuario
            </label>
            <input
              id="login-usuario"
              className="form-control login-input"
              value={nombreUsuario}
              autoComplete="username"
              onChange={(e) => setNombreUsuario(e.target.value)}
              placeholder="Tu nombre de usuario"
            />
          </div>

          <div>
            <label
              htmlFor="login-clave"
              className="form-label fw-semibold text-secondary small"
            >
              Contraseña
            </label>
            <input
              id="login-clave"
              type="password"
              className="form-control login-input"
              value={clave}
              autoComplete={primeraVez ? "new-password" : "current-password"}
              onChange={(e) => setClave(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {primeraVez && (
            <div>
              <label
                htmlFor="login-confirmar"
                className="form-label fw-semibold text-secondary small"
              >
                Confirmar contraseña
              </label>
              <input
                id="login-confirmar"
                type="password"
                className="form-control login-input"
                value={confirmar}
                autoComplete="new-password"
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="••••••••"
              />
              <small className="text-muted d-block mt-1">
                Mínimo 8 caracteres.
              </small>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-login w-100 mt-3"
            disabled={enviando}
          >
            {enviando
              ? "Verificando..."
              : primeraVez
                ? "Crear administrador y entrar"
                : "Entrar"}
          </button>
        </form>
      </div>

      {/* Ola decorativa */}
      <div className="login-wave-container">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="login-wave-svg"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.24,192.73,109.34,237.42,99.1,280.35,82.32,321.39,56.44Z"
            fill="#f8f9fa"
          ></path>
        </svg>
      </div>
    </div>
  );
}
