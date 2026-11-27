import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/Footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const irASeccion = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer-main">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3">
            <h5 className="footer-title">Navegación</h5>
            <ul className="list-unstyled">
              <li>
                <button
                  type="button"
                  onClick={() => irASeccion("inicio")}
                  className="footer-link btn btn-link p-0 text-start"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => irASeccion("sobre-nosotros")}
                  className="footer-link btn btn-link p-0 text-start"
                >
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => irASeccion("servicios")}
                  className="footer-link btn btn-link p-0 text-start"
                >
                  Nuestros Servicios
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => irASeccion("contacto")}
                  className="footer-link btn btn-link p-0 text-start"
                >
                  Contáctanos
                </button>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="footer-title">Información Legal</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/terminos" className="footer-link">
                  Política de Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="footer-link">
                  Política de Tratamiento de Datos Personales
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="footer-title">Información de Contacto</h5>
            <p className="mb-1 footer-text">Canal de WhatsApp</p>
            <p className="fw-bold mb-3">+57 316 3628861</p>
            <p className="mb-1 footer-text">Correo Electrónico</p>
            <p className="fw-bold mb-3">reserva@aescondida.com</p>
          </div>

          <div className="col-md-3">
            <h5 className="footer-title">Encuéntranos</h5>
            <p className="footer-text">
              Riohacha – km 3 vía Santa Marta (La Cachaca II)
            </p>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="text-center footer-text">
          <small>
            COPYRIGHT © {new Date().getFullYear()} Aescondidas. All Rights Reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}