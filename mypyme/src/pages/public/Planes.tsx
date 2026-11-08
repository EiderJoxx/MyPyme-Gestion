import { useState } from "react";
import { enlaceWhatsApp, formatoCOP } from "../../utils/whatsapp";
import "../../css/Cabanas.css";
import "../../css/Planes.css";

export default function Planes() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    personas: 1,
    plan: "Pool Day Experience",
    fecha: "",
    observaciones: "",
    terminos: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.terminos) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }

    const mensaje =
      `Hola, quiero reservar un pasadía:%0A%0A` +
      `👤 *Nombre:* ${form.nombre}%0A` +
      `📞 *Teléfono:* +57 ${form.telefono}%0A` +
      `✉️ *Email:* ${form.email}%0A` +
      `👥 *Personas:* ${form.personas}%0A` +
      `🏖️ *Plan:* ${form.plan}%0A` +
      `📅 *Fecha:* ${form.fecha}%0A` +
      `📝 *Notas:* ${form.observaciones || "Ninguna"}`;

    window.open(enlaceWhatsApp(mensaje), "_blank");
  };

  return (
    <>
      <section className="cabanas-hero">
        <div className="container position-relative z-1 text-center text-md-start">
          <h1 className="display-4 fw-bold mb-3">
            Planes y Experiencias para Disfrutar el Paraíso
          </h1>
          <p className="lead mb-0 planes-hero-text">
            Vive un día inolvidable frente al mar. Nuestros planes de pasadía
            están diseñados para que disfrutes del sol, la playa, la buena
            comida y la mejor vibra, ya sea en pareja, con amigos o en familia.
          </p>
        </div>
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

      <section className="container py-5">
        <div className="row align-items-center mb-5 pb-4">
          <div className="col-md-6 mb-4 mb-md-0 position-relative">
            <img
              src="/galeria/foto7.jpg"
              alt="Pool Day"
              className="img-fluid rounded-4 shadow cabanas-img"
            />
          </div>
          <div className="col-md-6 px-md-5">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h2 className="fw-bold cabanas-title">Pool Day Experience</h2>
                <p className="mb-3">
                  <strong>Horario:</strong> 10:00 a.m. – 6:00 p.m.
                </p>
              </div>
              <div className="price-badge text-center">
                <span className="d-block fw-bold fs-5">
                  {formatoCOP(75000)} COP
                </span>
                <small className="d-block">por persona</small>
              </div>
            </div>
            <p className="text-muted mb-4 planes-description">
              Disfruta un día completo de descanso y buena vibra frente al mar.
              Nuestro Pool Day Experience es perfecto para relajarte,
              refrescarte y disfrutar sin preocupaciones.
            </p>
          </div>
        </div>

        <div className="row align-items-center mb-5 pb-4 flex-md-row-reverse">
          <div className="col-md-6 mb-4 mb-md-0 position-relative">
            <img
              src="/galeria/foto2.jpg"
              alt="Pasadía Cover"
              className="img-fluid rounded-4 shadow cabanas-img"
            />
          </div>
          <div className="col-md-6 px-md-5">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h2 className="fw-bold cabanas-title">Pasadía Cover</h2>
                <p className="mb-3">
                  <strong>Horario:</strong> 12:00 m. – 6:00 p.m.
                </p>
              </div>
              <div className="price-badge text-center">
                <span className="d-block fw-bold fs-5">
                  {formatoCOP(75000)} COP
                </span>
                <small className="d-block">por persona</small>
              </div>
            </div>
            <p className="text-muted mb-4 planes-description">
              Vive la experiencia Playa Escondida y disfruta del mar, la piscina
              y nuestros espacios sociales en un ambiente relajado y natural.
            </p>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="fw-bold mb-5 planes-icons-title">
            ¿Qué incluye el hospedaje?
          </h2>
          <div className="row g-4 justify-content-center">
            {[
              { icon: "🏊", text: "Uso de piscina" },
              { icon: "🏝️", text: "Acceso a la playa" },
              { icon: "🪑", text: "Áreas sociales" },
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3">
                <div className="fs-1 mb-2">{item.icon}</div>
                <p className="fw-semibold small">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="planes-cta-section">
        <div className="planes-wave-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.24,192.73,109.34,237.42,99.1,280.35,82.32,321.39,56.44Z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>

        <div className="planes-cta-overlay"></div>

        <div className="container planes-cta-content">
          <h2 className="planes-cta-title">
            Un día es suficiente para desconectarte de la rutina y reconectarte
            con el mar, la buena vibra y los mejores momentos
          </h2>
        </div>
      </section>

      {/* FORMULARIO DE PASADÍA */}
      <section id="reservar-pasadia" className="py-5 planes-bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h4 className="mt-4">Reserva tu Pasadía en Playa Aescondida</h4>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <form onSubmit={handleSubmit} className="planes-form-container">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label fw-semibold">Teléfono</label>
                    <div className="input-group">
                      <span className="input-group-text">+57</span>
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
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">E-mail*</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label fw-semibold">
                      Número de personas
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
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Pasadía de interés
                    </label>
                    <select
                      className="form-select"
                      name="plan"
                      value={form.plan}
                      onChange={handleChange}
                    >
                      <option value="Pool Day Experience">
                        Pool Day Experience
                      </option>
                      <option value="Pasadía Cover">Pasadía Cover</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Fecha del pasadía
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="fecha"
                    required
                    value={form.fecha}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Observaciones o solicitudes especiales
                  </label>
                  <textarea
                    className="form-control"
                    name="observaciones"
                    rows={3}
                    value={form.observaciones}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="terminos"
                    id="terminos"
                    checked={form.terminos}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="terminos">
                    Acepto los términos y condiciones
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-whatsapp-submit w-100 py-3 fs-5"
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
