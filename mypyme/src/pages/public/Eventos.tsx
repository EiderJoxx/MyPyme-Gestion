import { useState } from "react";
import { enlaceWhatsApp } from "../../utils/whatsapp";
import "../../css/Cabanas.css";
import "../../css/Eventos.css";

export default function Eventos() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    personas: 1,
    horario: "",
    tipoEvento: "Cumpleaños",
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
      `Hola, quiero cotizar un evento:%0A%0A` +
      `👤 *Nombre:* ${form.nombre}%0A` +
      `📞 *Teléfono:* +57 ${form.telefono}%0A` +
      `✉️ *Email:* ${form.email}%0A` +
      `👥 *Personas:* ${form.personas}%0A` +
      `⏰ *Horario:* ${form.horario}%0A` +
      `🎉 *Tipo de evento:* ${form.tipoEvento}%0A` +
      `📅 *Fecha:* ${form.fecha}%0A` +
      `📝 *Notas:* ${form.observaciones || "Ninguna"}`;

    window.open(enlaceWhatsApp(mensaje), "_blank");
  };

  const scrollToForm = () => {
    const el = document.getElementById("formulario-evento");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="cabanas-hero">
        <div className="container position-relative z-1 text-center text-md-start">
          <h1 className="display-4 fw-bold mb-4">Eventos y Celebraciones</h1>
          <button onClick={scrollToForm} className="btn-hero-evento">
            ¡Reservar Evento!
          </button>
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
        <div className="row align-items-center g-5">
          <div className="col-md-6">
            <img
              src="/galeria/foto5.jpg"
              alt="Evento frente al mar"
              className="img-fluid rounded-4 shadow cabanas-img"
            />
          </div>
          <div className="col-md-6">
            <h2 className="eventos-title mb-4">
              Frente al Mar que se Viven y se Recuerdan
            </h2>
            <p className="lead text-muted mb-4">
              En Playa Escondida convertimos cada ocasión en una experiencia
              única.
            </p>
            <p className="text-muted" style={{ lineHeight: "1.8" }}>
              Ya sea una celebración especial, un evento corporativo o una
              fiesta privada, te ofrecemos el escenario perfecto frente al mar,
              con buena vibra, gastronomía y atención personalizada.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-5 mb-5">
        <div className="row align-items-center g-5 flex-md-row-reverse">
          <div className="col-md-6">
            <img
              src="/galeria/foto6.jpg"
              alt="Tipos de eventos"
              className="img-fluid rounded-4 shadow cabanas-img"
            />
          </div>
          <div className="col-md-6">
            <h2 className="eventos-title mb-4">Tipos de eventos</h2>
            <ul className="eventos-list">
              <li>
                <strong>🔹 Celebraciones sociales</strong>
                <p>
                  Cumpleaños, aniversarios, despedidas, reuniones entre amigos o
                  celebraciones especiales. Diseñamos el ambiente ideal para que
                  disfrutes sin preocupaciones.
                </p>
              </li>
              <li>
                <strong>🔹 Eventos corporativos</strong>
                <p>
                  Reuniones empresariales, integraciones de equipo, lanzamientos
                  o capacitaciones en un entorno diferente, relajado y
                  productivo.
                </p>
              </li>
              <li>
                <strong>🔹 Eventos privados</strong>
                <p>
                  Fiestas temáticas, celebraciones exclusivas o encuentros
                  personalizados con reserva del espacio y atención dedicada.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="eventos-blue-section">
        <div className="container">
          <h2 className="fw-bold mb-5">¿Qué incluyen nuestros eventos?</h2>
          <div className="row g-4 justify-content-center">
            {[
              { icon: "🌴", text: "Espacios frente al mar" },
              { icon: "🏊", text: "Acceso a playa y piscina" },
              { icon: "🛋️", text: "Áreas sociales y lounge" },
              { icon: "🍽️", text: "Opciones de alimentación y bebidas" },
              { icon: "📋", text: "Apoyo en logística y organización" },
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-2">
                <div className="eventos-icon-box">
                  <div className="icon">{item.icon}</div>
                  <span>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
          <h3 className="mt-5 fw-bold" style={{ fontStyle: "italic" }}>
            Celebra, comparte y crea recuerdos inolvidables frente al mar.
          </h3>
        </div>
      </section>
      <section id="formulario-evento" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="eventos-title">¡Tu evento está en camino!</h2>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <form onSubmit={handleSubmit} className="eventos-form-container">
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
                      Horario estimado
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      name="horario"
                      required
                      value={form.horario}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label fw-semibold">
                      Tipo de evento
                    </label>
                    <select
                      className="form-select"
                      name="tipoEvento"
                      value={form.tipoEvento}
                      onChange={handleChange}
                    >
                      <option value="Cumpleaños">Cumpleaños</option>
                      <option value="Aniversario">Aniversario</option>
                      <option value="Evento corporativo">
                        Evento corporativo
                      </option>
                      <option value="Fiesta privada">Fiesta privada</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Fecha del evento
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
