import { useState } from "react";
import Carrusel2 from "../../components/Carrusel2";
import {
  mensajeReserva,
  enlaceWhatsApp,
  nochesEntre,
  formatoCOP,
} from "../../utils/whatsapp";
import { useReservas } from "../../hooks/useReservas";
import { habitaciones } from "../../data/datosPrueba";
import type { EstadoReserva } from "../../types";

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
      negocio: "MyPyme",
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
      {/* SECCIÓN INICIO (CARRUSEL) */}
      <section id="inicio">
        <Carrusel2 />
      </section>

      {/* SECCIÓN HOSPEDAJE (HABITACIONES) */}
      <section id="hospedaje" className="container py-5">
        <h2 className="text-center mb-2 fw-bold">Nuestras Habitaciones</h2>
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
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  {/* IMAGEN DE LA HABITACIÓN */}
                  {h.imagen && (
                    <img
                      src={h.imagen}
                      alt={`Habitación ${h.numero}`}
                      className="card-img-top"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  )}

                  <div className="card-body text-center d-flex flex-column">
                    <h3 className="card-title fw-bold text-primary">
                      Habitación {h.numero}
                    </h3>
                    <h5 className="card-subtitle mb-3 text-muted">{h.tipo}</h5>

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
      </section>

      {/* SECCIÓN FORMULARIO */}
      <section id="reservar" className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0">
                <div className="card-body p-4 p-md-5">
                  <h2 className="text-center mb-4 fw-bold">Haz tu Reserva</h2>
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
                            noche)
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
                      className="btn btn-success w-100 py-3 fw-bold fs-5"
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

      {/* SECCIÓN DE CONTACTO Y UBICACIÓN */}
      <section id="contacto" className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row g-5">
            <div className="col-md-6">
              <h2 className="fw-bold mb-4">¿Dónde estamos?</h2>
              <p className="mb-4 text-light">
                Estamos ubicados en un paraíso frente al mar. Ven a disfrutar de
                nuestras instalaciones, la playa y la mejor atención.
              </p>

              <ul className="list-unstyled fs-5">
                <li className="mb-3">
                  📍 <strong>Dirección:</strong> Vía al Mar Km 4, Sector Playa
                  Linda
                </li>
                <li className="mb-3">
                  📞 <strong>Teléfono:</strong> +57 315 061 9207
                </li>
                <li className="mb-3">
                  ✉️ <strong>Email:</strong> reservas@mypyme.com
                </li>
              </ul>
            </div>

            <div className="col-md-6">
              <div className="ratio ratio-4x3 rounded overflow-hidden shadow">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15741.602176498908!2d-75.53429834999999!3d9.25316915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e59d003fca40001%3A0xefb5c9c0c3b4e0!2sPlaya%20Linda%2C%20San%20Onofre%2C%20Sucre!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Ubicación MyPyme"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
