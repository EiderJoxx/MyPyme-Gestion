import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark py-4 mt-auto" data-bs-theme="dark">
      <div className="container">
        <ul className="nav justify-content-center border-bottom border-secondary pb-3 mb-3">
          <li className="nav-item">
            <Link to="/" className="nav-link px-2 text-body-secondary">
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <a href="/#hospedaje" className="nav-link px-2 text-body-secondary">
              Hospedaje
            </a>
          </li>
          <li className="nav-item">
            <a href="/#servicios" className="nav-link px-2 text-body-secondary">
              Servicios
            </a>
          </li>
          <li className="nav-item">
            <a href="/#contacto" className="nav-link px-2 text-body-secondary">
              Contacto
            </a>
          </li>
          <li className="nav-item">
            <Link
              to="/login"
              className="nav-link px-2 text-body-secondary"
            ></Link>
          </li>
        </ul>
        <p className="text-center text-body-secondary mb-0">© 2026 MyPyme</p>
      </div>
    </footer>
  );
}
