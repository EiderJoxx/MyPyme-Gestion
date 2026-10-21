import { useEffect, useRef } from "react";
import { Carousel } from "bootstrap";

const diapositivas = [
  {
    titulo: "Gestiona todo tu negocio",
    texto: "Hospedaje, restaurante y bar en un solo sistema.",
    fondo: "linear-gradient(135deg, #0e3b43, #0e7c86)",
  },
  {
    titulo: "Reservas sin papel",
    texto: "Consulta la disponibilidad de habitaciones en tiempo real.",
    fondo: "linear-gradient(135deg, #1f3b5c, #2f8cff)",
  },
  {
    titulo: "Inventario y cuentas en orden",
    texto: "Controla gastos, ventas y existencias al día.",
    fondo: "linear-gradient(135deg, #3b2a5c, #7b5cd6)",
  },
];

export default function Carrusel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const carrusel = Carousel.getOrCreateInstance(ref.current, {
      ride: "carousel",
    });
    return () => carrusel.dispose();
  }, []);

  return (
    <div id="carruselInicio" className="carousel slide" ref={ref}>
      <div className="carousel-indicators">
        {diapositivas.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#carruselInicio"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-label={`Diapositiva ${i + 1}`}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {diapositivas.map((d, i) => (
          <div
            key={d.titulo}
            className={i === 0 ? "carousel-item active" : "carousel-item"}
          >
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center text-white px-4"
              style={{ background: d.fondo, height: 420 }}
            >
              <h2 className="display-5 fw-bold">{d.titulo}</h2>
              <p className="lead mb-0">{d.texto}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carruselInicio"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carruselInicio"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
}
