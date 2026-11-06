import "../css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3">
            <h5 className="footer-title">Navegación</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#inicio" className="footer-link">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#sobre-nosotros" className="footer-link">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#hospedaje" className="footer-link">
                  Nuestros Servicios
                </a>
              </li>
              <li>
                <a href="#contacto" className="footer-link">
                  Contáctanos
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="footer-title">Información Legal</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="footer-link">
                  Política de Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Política de Tratamiento de Datos Personales
                </a>
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
            COPYRIGHT © {new Date().getFullYear()} Aescondidas. All Rights
            Reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}
