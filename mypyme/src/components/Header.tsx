import { Link } from "react-router-dom";
import "../css/Header.css";

export default function Header() {
  return (
    <header className="header-main py-2">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <img
            src="../../public/galeria/logo.jpg"
            alt="Aescondidas Logo"
            className="header-logo"
          />
        </Link>

        <nav className="d-none d-lg-flex align-items-center gap-4 header-nav">
          <a href="#inicio" className="header-link">
            Inicio
          </a>
          <a href="#sobre-nosotros" className="header-link">
            Sobre Nosotros
          </a>

          <div className="dropdown">
            <button
              className="btn text-white fw-bold p-0 dropdown-toggle border-0 header-dropdown-btn"
              data-bs-toggle="dropdown"
            >
              Nuestros Servicios
            </button>
            <ul className="dropdown-menu shadow border-0">
              <li>
                <a className="dropdown-item" href="#hospedaje">
                  Cabañas Frente al Mar
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#servicios">
                  Planes y Experiencias
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#contacto">
                  Eventos y celebraciones
                </a>
              </li>
            </ul>
          </div>

          <a href="#contacto" className="header-link">
            Contáctanos
          </a>
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
