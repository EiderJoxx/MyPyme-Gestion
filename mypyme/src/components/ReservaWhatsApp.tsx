import { useMemo, useState } from "react";
import {
  enlaceWhatsApp,
  formatoCOP,
  formatoFecha,
  hayCruce,
  mensajeReserva,
  nochesEntre,
  type RangoOcupado,
} from "../utils/whatsapp";

export interface HabitacionPublica {
  id: string | number;
  nombre: string;
  capacidad: number;
  precio: number; // por noche
  ocupadas: RangoOcupado[]; // reservas existentes de esa habitación
}

type Props = { habitaciones: HabitacionPublica[]; negocio?: string };

export default function ReservaWhatsApp({
  habitaciones,
  negocio = "MyPyme",
}: Props) {
  const hoy = new Date().toLocaleDateString("sv-SE"); // AAAA-MM-DD en hora local
  const [habId, setHabId] = useState(String(habitaciones[0]?.id ?? ""));
  const [entrada, setEntrada] = useState("");
  const [salida, setSalida] = useState("");
  const [personas, setPersonas] = useState(2);
  const [nombre, setNombre] = useState("");

  const hab = habitaciones.find((h) => String(h.id) === habId);

  const proximas = useMemo(
    () =>
      (hab?.ocupadas ?? [])
        .filter((r) => r.salida > hoy)
        .sort((a, b) => a.entrada.localeCompare(b.entrada)),
    [hab, hoy],
  );

  const resultado = useMemo(() => {
    if (!hab)
      return { tipo: "info", texto: "No hay habitaciones para mostrar." };
    if (!entrada || !salida)
      return {
        tipo: "info",
        texto: "Elige tus fechas para ver la disponibilidad.",
      };
    if (salida <= entrada)
      return {
        tipo: "error",
        texto: "La salida debe ser después de la llegada.",
      };
    const c = hayCruce(hab.ocupadas, entrada, salida);
    if (c)
      return {
        tipo: "error",
        texto: `${hab.nombre} está ocupada del ${formatoFecha(c.entrada)} al ${formatoFecha(c.salida)}. Prueba otras fechas u otra habitación.`,
      };
    if (personas < 1 || personas > hab.capacidad)
      return {
        tipo: "error",
        texto: `Esta habitación admite de 1 a ${hab.capacidad} personas.`,
      };
    const noches = nochesEntre(entrada, salida);
    const total = noches * hab.precio;
    if (!nombre.trim())
      return {
        tipo: "ok",
        texto: `Disponible: ${noches} noche(s), ${formatoCOP(total)}. Escribe tu nombre para continuar.`,
      };
    const enlace = enlaceWhatsApp(
      mensajeReserva({
        negocio,
        habitacion: hab.nombre,
        entrada,
        salida,
        noches,
        personas,
        total,
        nombre: nombre.trim(),
      }),
    );
    return {
      tipo: "ok",
      texto: `Disponible: ${noches} noche(s), ${formatoCOP(total)}. Envía la solicitud por WhatsApp.`,
      enlace,
    };
  }, [hab, entrada, salida, personas, nombre, negocio]);

  const clase = {
    info: "alert-secondary",
    error: "alert-danger",
    ok: "alert-success",
  }[resultado.tipo as "info" | "error" | "ok"];

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Reserva por WhatsApp</h2>
        <p className="text-muted">
          Completa los datos y se abrirá WhatsApp con tu mensaje listo para
          enviar.
        </p>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="rw-hab">
              Habitación
            </label>
            <select
              id="rw-hab"
              className="form-select"
              value={habId}
              onChange={(e) => setHabId(e.target.value)}
            >
              {habitaciones.map((h) => (
                <option key={h.id} value={String(h.id)}>
                  {h.nombre} · {formatoCOP(h.precio)} / noche
                </option>
              ))}
            </select>
            <div className="form-text">
              {proximas.length ? (
                <>
                  Fechas ocupadas:{" "}
                  {proximas
                    .map(
                      (r) =>
                        `${formatoFecha(r.entrada)} – ${formatoFecha(r.salida)}`,
                    )
                    .join(" | ")}
                </>
              ) : (
                "Sin fechas ocupadas próximas."
              )}
            </div>
          </div>
          <div className="col-md-3 col-6">
            <label className="form-label" htmlFor="rw-ent">
              Llegada
            </label>
            <input
              id="rw-ent"
              type="date"
              className="form-control"
              min={hoy}
              value={entrada}
              onChange={(e) => {
                setEntrada(e.target.value);
                if (salida <= e.target.value) setSalida("");
              }}
            />
          </div>
          <div className="col-md-3 col-6">
            <label className="form-label" htmlFor="rw-sal">
              Salida
            </label>
            <input
              id="rw-sal"
              type="date"
              className="form-control"
              min={entrada || hoy}
              value={salida}
              onChange={(e) => setSalida(e.target.value)}
            />
          </div>
          <div className="col-md-3 col-6">
            <label className="form-label" htmlFor="rw-per">
              Personas
            </label>
            <input
              id="rw-per"
              type="number"
              className="form-control"
              min={1}
              max={hab?.capacidad}
              value={personas}
              onChange={(e) => setPersonas(Number(e.target.value))}
            />
          </div>
          <div className="col-md-9 col-12">
            <label className="form-label" htmlFor="rw-nom">
              Tu nombre
            </label>
            <input
              id="rw-nom"
              type="text"
              className="form-control"
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
        </div>

        <div className={`alert ${clase} mt-3 mb-3`} role="status">
          {resultado.texto}
        </div>

        <a
          className={`btn btn-success w-100 ${resultado.enlace ? "" : "disabled"}`}
          href={resultado.enlace}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!resultado.enlace}
        >
          Reservar por WhatsApp
        </a>
      </div>
    </div>
  );
}
