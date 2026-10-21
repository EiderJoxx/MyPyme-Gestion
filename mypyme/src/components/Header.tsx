import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-dark border-bottom border-secondary"
      data-bs-theme="dark"
    >
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          MyPyme
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" end className="nav-link">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <a href="/#servicios" className="nav-link">
                Servicios
              </a>
            </li>
          </ul>

          <Link to="/login" className="btn btn-primary">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}
