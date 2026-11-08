import { useState } from "react";
import { enlaceWhatsApp } from "../../utils/whatsapp";
import "../../css/Cabanas.css";
import "../../css/Contacto.css";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mensaje =
      `Hola, me gustaría ponerme en contacto con ustedes:%0A%0A` +
      `👤 *Nombre:* ${form.nombre}%0A` +
      `📞 *Teléfono:* +57 ${form.telefono}%0A` +
      `✉️ *Email:* ${form.email}%0A` +
      `📝 *Mensaje:* ${form.mensaje}`;

    window.open(enlaceWhatsApp(mensaje), "_blank");
  };

  return (
    <>
      <section className="cabanas-hero">
        <div className="container position-relative z-1 text-center text-md-start">
          <h1 className="display-3 fw-bold mb-3">Contáctanos</h1>
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

      <section className="contact-section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <h2 className="contact-title">
                Planea tu visita a Playa Escondida
              </h2>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      required
                      value={form.nombre}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono *</label>
                    <div className="input-group">
                      <span className="input-group-text">🇨🇴 +57</span>
                      <input
                        type="tel"
                        className="form-control"
                        name="telefono"
                        placeholder="321 1234567"
                        required
                        value={form.telefono}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">E-mail *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Mensaje o consulta</label>
                  <textarea
                    className="form-control"
                    name="mensaje"
                    rows={4}
                    required
                    value={form.mensaje}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-whatsapp-submit px-5 py-3 fs-5"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>

            <div className="col-lg-5">
              <div className="contact-info-card">
                <h3 className="contact-info-title">
                  Algunas formas de
                  <br />
                  conectarse con nosotros
                </h3>

                <div className="contact-info-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="contact-info-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <div className="contact-info-label">Canal de WhatsApp</div>
                  <div className="contact-info-value">+57 315 0619207</div>
                </div>

                <div className="contact-info-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="contact-info-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="contact-info-label">Correo Electrónico</div>
                  <div className="contact-info-value">
                    reserva@aescondida.com
                  </div>
                </div>

                <div className="contact-info-item mb-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="contact-info-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div className="contact-info-label">Encuéntranos</div>
                  <div className="contact-info-value">
                    Riohacha – km 3 vía Santa Marta (La Cachaca II)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <iframe
          src="https://maps.google.com/maps?q=11.5183851,-72.9656908&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="contact-map"
          allowFullScreen
          loading="lazy"
          title="Ubicación Playa Aescondidas"
        ></iframe>
      </section>
    </>
  );
}
