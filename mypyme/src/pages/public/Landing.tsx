import { useState } from "react";
import Carrusel2 from "../../components/Carrusel2";
import Footer from "../../components/Footer";
import {
  mensajeReserva,
  enlaceWhatsApp,
  nochesEntre,
  formatoCOP,
} from "../../utils/whatsapp";
import { useReservas } from "../../hooks/useReservas";
import { habitaciones } from "../../data/datosPrueba";
import type { EstadoReserva } from "../../types";
import "../../css/Landing.css"; // <-- Importamos el CSS del Landing

export default function Landing() {
  const { crear } = useReservas();

  const [form, setForm] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    entrada: "",
    salida: "",
    personas: 1,
    habitacionId: habitaciones[0]?.id || 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const seleccionarHabitacion = (id: number) => {
    setForm({ ...form, habitacionId: id });
    const el = document.getElementById("reservar");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.entrada >= form.salida) {
      alert("La fecha de salida debe ser posterior a la de entrada.");
      return;
    }

    const habitacionSeleccionada = habitaciones.find(
      (h) => h.id === Number(form.habitacionId),
    );
    if (!habitacionSeleccionada) return;

    const noches = nochesEntre(form.entrada, form.salida);
    const total = noches * habitacionSeleccionada.precioNoche;

    crear({
      cliente: form.nombre,
      documento: form.documento,
      telefono: form.telefono,
      habitacionId: habitacionSeleccionada.id,
      personas: Number(form.personas),
      checkIn: form.entrada,
      checkOut: form.salida,
      estado: "Pendiente" as EstadoReserva,
      precioNoche: habitacionSeleccionada.precioNoche,
      anticipo: 0,
      notas: "Reserva creada desde la página web",
    });

    const mensaje = mensajeReserva({
      negocio: "Aescondidas",
      habitacion: `Habitación ${habitacionSeleccionada.numero} (${habitacionSeleccionada.tipo})`,
      entrada: form.entrada,
      salida: form.salida,
      noches,
      personas: Number(form.personas),
      total,
      nombre: form.nombre,
    });

    window.open(enlaceWhatsApp(mensaje), "_blank");

    setForm({
      nombre: "",
      documento: "",
      telefono: "",
      entrada: "",
      salida: "",
      personas: 1,
      habitacionId: habitaciones[0]?.id || 1,
    });
  };

  const habitacionesDisponibles = habitaciones.filter(
    (h) => h.estado === "Disponible",
  );

  return (
    <>
      <div id="inicio">
        <Carrusel2 />
      </div>

      {/* SECCIÓN SOBRE NOSOTROS */}
      <section id="sobre-nosotros" className="about-section">
        <div className="container position-relative z-1">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h2 className="display-5 fw-bold mb-4">Sobre nosotros</h2>
              <p className="lead mb-0">
                Playa Aescondidas es un hostal y restaurante frente al mar,
                creado para quienes buscan descansar, compartir y disfrutar de
                la esencia del Caribe en un entorno natural, tranquilo y con la
                mejor energía.
              </p>
            </div>
          </div>
        </div>

        {/* Onda SVG */}
        <div className="about-wave-container">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="about-wave-svg"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.24,192.73,109.34,237.42,99.1,280.35,82.32,321.39,56.44Z"
              fill="#f8f9fa"
            ></path>
          </svg>
        </div>
      </section>

      {/* SECCIÓN MÁS QUE UN LUGAR */}
      <section className="experience-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-5">
              <img
                src="/galeria/foto1.jpg"
                alt="Playa Aescondidas"
                className="experience-image"
              />
            </div>
            <div className="col-md-7">
              <h2 className="display-6 experience-title mb-4">
                Más que un lugar,
                <br />
                una experiencia
              </h2>
              <p className="lead text-muted mb-4">
                Creemos en los espacios donde la buena vibra se siente desde que
                llegas. En Playa Aescondidas combinamos hospitalidad, naturaleza
                y atención cercana para que cada visita se convierta en un
                recuerdo inolvidable, ya sea en un pasadía, una estadía o un
                evento especial.
              </p>
              <h4 className="experience-subtitle mb-3">
                Frente al mar, lejos del ruido
              </h4>
              <p className="text-muted">
                Nuestra ubicación privilegiada frente al mar Caribe te permite
                disfrutar de atardeceres únicos, brisa constante y un ambiente
                ideal para relajarte. Estamos a pocos minutos de Riohacha, pero
                lo suficientemente alejados para ofrecer tranquilidad y
                privacidad.
              </p>

              <h5 className="experience-subtitle mt-4 mb-3">
                Lo que nos diferencia:
              </h5>
              <ul className="experience-list">
                <li>✔️ Atención cálida y personalizada</li>
                <li>✔️ Espacios naturales frente al mar</li>
                <li>✔️ Ideal para amigos, parejas y familias</li>
                <li>✔️ Planes flexibles</li>
                <li>✔️ Gastronomía con identidad caribeña</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN HABITACIONES */}
      <section id="hospedaje" className="rooms-section">
        <div className="container">
          <h2 className="text-center mb-2 rooms-title">
            Nuestras Habitaciones
          </h2>
          <p className="text-center text-muted mb-5">
            Elige la opción perfecta para tu estadía y reserva al instante.
          </p>

          <div className="row g-4 justify-content-center">
            {habitacionesDisponibles.length === 0 ? (
              <div className="col-12 text-center text-muted">
                <p>Por el momento no hay habitaciones disponibles.</p>
              </div>
            ) : (
              habitacionesDisponibles.map((h) => (
                <div key={h.id} className="col-md-6 col-lg-4">
                  <div className="card room-card">
                    {h.imagen && (
                      <img
                        src={h.imagen}
                        alt={`Habitación ${h.numero}`}
                        className="room-image"
                      />
                    )}
                    <div className="card-body text-center d-flex flex-column">
                      <h3 className="card-title room-title">
                        Habitación {h.numero}
                      </h3>
                      <h5 className="card-subtitle mb-3 text-muted">
                        {h.tipo}
                      </h5>
                      <ul className="list-unstyled mb-4">
                        <li className="mb-2">
                          👥 Capacidad: <strong>{h.capacidad} personas</strong>
                        </li>
                        <li className="mb-2">
                          💲 Precio:{" "}
                          <strong>{formatoCOP(h.precioNoche)} / noche</strong>
                        </li>
                      </ul>
                      <div className="mt-auto">
                        <button
                          onClick={() => seleccionarHabitacion(h.id)}
                          className="btn btn-outline-success w-100 fw-bold"
                        >
                          Seleccionar y Reservar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* SECCIÓN FORMULARIO */}
      <section id="reservar" className="booking-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card booking-card">
                <div className="card-body p-4 p-md-5">
                  <h2 className="text-center mb-4 booking-title">
                    Haz tu Reserva
                  </h2>
                  <p className="text-center text-muted mb-4">
                    Completa los datos y te enviaremos a nuestro WhatsApp para
                    confirmar.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Habitación seleccionada
                      </label>
                      <select
                        className="form-select"
                        name="habitacionId"
                        value={form.habitacionId}
                        onChange={handleChange}
                      >
                        {habitaciones.map((h) => (
                          <option
                            key={h.id}
                            value={h.id}
                            disabled={h.estado !== "Disponible"}
                          >
                            {h.numero} - {h.tipo} ({formatoCOP(h.precioNoche)} /
                            noche){" "}
                            {h.estado !== "Disponible"
                              ? " - No disponible"
                              : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">
                          Entrada
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="entrada"
                          required
                          value={form.entrada}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Salida</label>
                        <input
                          type="date"
                          className="form-control"
                          name="salida"
                          required
                          value={form.salida}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        N° de Personas
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="personas"
                        min="1"
                        required
                        value={form.personas}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        required
                        value={form.nombre}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="row mb-4">
                      <div className="col-6">
                        <label className="form-label fw-semibold">
                          Documento / Cédula
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="documento"
                          required
                          value={form.documento}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          name="telefono"
                          required
                          value={form.telefono}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-whatsapp-submit w-100"
                    >
                      Reservar y enviar a WhatsApp
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/573163628861?text=Hola,%20quisiera%20más%20información%20sobre%20Playa%20Aescondidas"
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          fill="white"
          viewBox="0 0 16 16"
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
        </svg>
      </a>

      <Footer />
    </>
  );
}
