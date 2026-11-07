import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const irASeccion = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="header-main py-2">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <img
            src="/galeria/logo.jpg"
            alt="Aescondidas Logo"
            className="header-logo"
          />
        </Link>

        {/* Navegación Escritorio */}
        <nav className="d-none d-lg-flex align-items-center gap-4 header-nav">
          <button
            onClick={() => irASeccion("inicio")}
            className="btn btn-link header-link p-0"
          >
            Inicio
          </button>

          <button
            onClick={() => irASeccion("sobre-nosotros")}
            className="btn btn-link header-link p-0"
          >
            Sobre Nosotros
          </button>

          {/* Menú Desplegable */}
          <div className="dropdown">
            <button
              className="btn text-white fw-bold p-0 dropdown-toggle border-0 header-dropdown-btn"
              data-bs-toggle="dropdown"
            >
              Nuestros Servicios
            </button>
            <ul className="dropdown-menu shadow border-0">
              <li>
                <Link className="dropdown-item" to="/cabanas-frente-al-mar">
                  Cabañas Frente al Mar
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => irASeccion("servicios")}
                >
                  Planes y Experiencias
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => irASeccion("contacto")}
                >
                  Eventos y celebraciones
                </button>
              </li>
            </ul>
          </div>

          <button
            onClick={() => irASeccion("contacto")}
            className="btn btn-link header-link p-0"
          >
            Contáctanos
          </button>
        </nav>

        <Link
          to="/login"
          className="btn btn-outline-warning btn-sm fw-bold d-none d-lg-block"
        >
          Ingresar
        </Link>
      </div>
    </header>
  );
}
