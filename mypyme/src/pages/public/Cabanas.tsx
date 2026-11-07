import { habitaciones } from "../../data/datosPrueba";
import { formatoCOP, enlaceWhatsApp } from "../../utils/whatsapp";
import "../../css/Cabanas.css";

export default function Cabanas() {
  const habitacionesDisponibles = habitaciones.filter(
    (h) => h.estado === "Disponible",
  );

  const handleReservar = (habitacion: string, precio: number) => {
    const mensaje = `Hola, estoy interesado en reservar la ${habitacion} (${formatoCOP(precio)} por noche). ¿Tienen disponibilidad?`;
    window.open(enlaceWhatsApp(mensaje), "_blank");
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="cabanas-hero">
        <div className="container position-relative z-1 text-center text-md-start">
          <h1 className="display-4 fw-bold mb-3">
            Hospédate frente al mar y despierta con la brisa del Caribe
          </h1>
          <p className="lead mb-0" style={{ maxWidth: "800px" }}>
            Nuestras cabañas están diseñadas para ofrecerte comodidad,
            privacidad y una experiencia auténtica frente al mar. Son ideales
            para parejas, familias o grupos que buscan descansar y desconectarse
            de la rutina.
          </p>
        </div>
        {/* Onda SVG */}
        <div className="cabanas-wave-container">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="cabanas-wave-svg"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.24,192.73,109.34,237.42,99.1,280.35,82.32,321.39,56.44Z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      </section>

      {/* LISTADO DE CABAÑAS */}
      <section className="container py-5">
        {habitacionesDisponibles.map((h, index) => (
          <div
            key={h.id}
            className={`row align-items-center mb-5 pb-4 ${index % 2 !== 0 ? "flex-md-row-reverse" : ""}`}
          >
            {/* Imagen con flechas (simuladas) */}
            <div className="col-md-6 mb-4 mb-md-0 position-relative">
              <img
                src={h.imagen}
                alt={h.tipo}
                className="img-fluid rounded-4 shadow cabanas-img"
              />
              <div className="cabanas-img-arrows">
                <button className="btn-arrow">‹</button>
                <button className="btn-arrow">›</button>
              </div>
            </div>

            {/* Información */}
            <div className="col-md-6 px-md-5">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="fw-bold cabanas-title">{h.tipo}</h2>
                  <p className="mb-1">
                    <strong>Check in:</strong> {h.checkIn}
                  </p>
                  <p className="mb-1">
                    <strong>Check out:</strong> {h.checkOut}
                  </p>
                  <p className="mb-3">
                    <strong>Capacidad:</strong> {h.capacidad} personas
                  </p>
                </div>
                {/* Etiqueta de precio */}
                <div className="price-badge text-center">
                  <span className="d-block fw-bold fs-5">
                    {formatoCOP(h.precioNoche)} COP
                  </span>
                  <small className="d-block">por noche</small>
                </div>
              </div>

              <p className="text-muted mb-4" style={{ lineHeight: "1.7" }}>
                {h.descripcion}
              </p>

              <button
                onClick={() => handleReservar(h.tipo, h.precioNoche)}
                className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                style={{ backgroundColor: "#004b93", border: "none" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z" />
                </svg>
                ¡Quiero Reservar!
              </button>
            </div>
          </div>
        ))}
      </section>

      <section
        className="bg-primary text-white py-5"
        style={{ backgroundColor: "#0078b8 !important" }}
      >
        <div className="container text-center">
          <h2 className="fw-bold mb-5">¿Qué incluye el hospedaje?</h2>
          <div className="row g-4 justify-content-center">
            {[
              { icon: "🏠", text: "Cabañas cómodas y privadas" },
              { icon: "🏝️", text: "Acceso directo a la playa" },
              { icon: "🏊", text: "Uso de piscina" },
              { icon: "🪑", text: "Áreas sociales" },
              { icon: "🍳", text: "Desayuno incluido (Según el plan)" },
              { icon: "🍹", text: "Cóctel de bienvenida" },
              { icon: "🎈", text: "Decoración para ocasiones románticas" },
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3">
                <div className="fs-1 mb-2">{item.icon}</div>
                <p className="fw-semibold small">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="fw-bold mb-4 cabanas-title">
            Disfruta de nuestros espacios
          </h2>
          <div className="row g-2">
            <div className="col-md-4">
              <img
                src="/galeria/foto7.jpg"
                alt="Espacio 1"
                className="img-fluid w-100 h-100 object-fit-cover rounded"
              />
            </div>
            <div className="col-md-4">
              <img
                src="/galeria/foto2.jpg"
                alt="Espacio 2"
                className="img-fluid w-100 h-100 object-fit-cover rounded"
              />
            </div>
            <div className="col-md-4">
              <img
                src="/galeria/foto8.jpg"
                alt="Espacio 3"
                className="img-fluid w-100 h-100 object-fit-cover rounded"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
