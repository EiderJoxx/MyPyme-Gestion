import { useState } from "react";
import type { Habitacion, Reserva } from "../../types";
import { dinero } from "../../utils/formato";
import { hoyISO, nochesEntre, sumarDias } from "../../utils/fechas";
import { estaLibre } from "../../utils/reservas";

interface Props {
  editando: Reserva | null;
  habitaciones: Habitacion[];
  reservas: Reserva[];
  onGuardar: (datos: Omit<Reserva, "id">, id?: number) => void;
  onCancelar: () => void;
}

export default function FormularioReserva({
  editando,
  habitaciones,
  reservas,
  onGuardar,
  onCancelar,
}: Props) {
  const hoy = hoyISO();
  const [entrada, setEntrada] = useState(editando?.checkIn ?? hoy);
  const [salida, setSalida] = useState(editando?.checkOut ?? sumarDias(hoy, 1));
  const [personas, setPersonas] = useState(
    editando ? String(editando.personas) : "2",
  );
  const [habitacionId, setHabitacionId] = useState(
    editando ? String(editando.habitacionId) : "",
  );
  const [cliente, setCliente] = useState(editando?.cliente ?? "");
  const [documento, setDocumento] = useState(editando?.documento ?? "");
  const [telefono, setTelefono] = useState(editando?.telefono ?? "");
  const [anticipo, setAnticipo] = useState("");
  const [notas, setNotas] = useState(editando?.notas ?? "");
  const [error, setError] = useState("");

  const entradaValida = entrada >= hoy || entrada === editando?.checkIn;
  const fechasValidas = entradaValida && salida > entrada;
  const nPersonas = Number(personas) || 1;

  // Al editar, la reserva no se compara contra sí misma
  const otras = reservas.filter((r) => r.id !== editando?.id);

  const libres = fechasValidas
    ? habitaciones
        .filter(
          (h) =>
            h.id === editando?.habitacionId || h.estado !== "Mantenimiento",
        )
        .filter((h) => h.capacidad >= nPersonas)
        .filter((h) => estaLibre(h.id, otras, entrada, salida))
        .sort((a, b) =>
          a.numero.localeCompare(b.numero, undefined, { numeric: true }),
        )
    : [];

  const habitacion = libres.find((h) => String(h.id) === habitacionId);
  const noches = fechasValidas ? nochesEntre(entrada, salida) : 0;
  // Si no cambia de habitación se conserva el precio de la reserva original
  const precioNoche = habitacion
    ? habitacion.id === editando?.habitacionId
      ? editando.precioNoche
      : habitacion.precioNoche
    : 0;
  const total = noches * precioNoche;

  function cambiarEntrada(valor: string) {
    setEntrada(valor);
    if (salida <= valor) setSalida(sumarDias(valor, 1));
  }

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!fechasValidas) {
      return setError(
        !entradaValida
          ? "La entrada no puede ser anterior a hoy"
          : "La salida debe ser posterior a la entrada",
      );
    }
    if (!habitacion) return setError("Elige una habitación disponible");
    if (!cliente.trim()) return setError("Escribe el nombre del huésped");

    const base = {
      cliente: cliente.trim(),
      documento: documento.trim(),
      telefono: telefono.trim(),
      habitacionId: habitacion.id,
      personas: nPersonas,
      checkIn: entrada,
      checkOut: salida,
      precioNoche,
      notas: notas.trim(),
    };

    if (editando) {
      if (total < editando.anticipo) {
        return setError(
          `El total no puede ser menor a lo ya pagado (${dinero(editando.anticipo)})`,
        );
      }
      onGuardar(
        { ...base, estado: editando.estado, anticipo: editando.anticipo },
        editando.id,
      );
      return;
    }

    const abono = Number(anticipo) || 0;
    if (abono < 0 || abono > total)
      return setError("El anticipo no puede ser mayor al total de la estadía");

    onGuardar({
      ...base,
      estado: abono > 0 ? "Confirmada" : "Pendiente",
      anticipo: abono,
    });

    setHabitacionId("");
    setCliente("");
    setDocumento("");
    setTelefono("");
    setAnticipo("");
    setNotas("");
    setError("");
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">
          {editando ? "Editar reserva" : "Nueva reserva"}
        </h2>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div className="row g-3">
          <div className="col-6">
            <label htmlFor="res-entrada" className="form-label">
              Entrada
            </label>
            <input
              id="res-entrada"
              type="date"
              className="form-control"
              min={editando ? undefined : hoy}
              value={entrada}
              onChange={(e) => cambiarEntrada(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label htmlFor="res-salida" className="form-label">
              Salida
            </label>
            <input
              id="res-salida"
              type="date"
              className="form-control"
              min={sumarDias(entrada, 1)}
              value={salida}
              onChange={(e) => setSalida(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="res-personas" className="form-label">
            Personas
          </label>
          <input
            id="res-personas"
            type="number"
            min="1"
            className="form-control"
            value={personas}
            onChange={(e) => setPersonas(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="res-habitacion" className="form-label">
            Habitación disponible
          </label>
          <select
            id="res-habitacion"
            className="form-select"
            value={habitacion ? habitacionId : ""}
            onChange={(e) => setHabitacionId(e.target.value)}
            disabled={libres.length === 0}
          >
            <option value="">
              {libres.length === 0
                ? "Sin habitaciones libres"
                : "Selecciona una habitación"}
            </option>
            {libres.map((h) => (
              <option key={h.id} value={h.id}>
                {h.numero} · {h.tipo} · {h.capacidad} pers. ·{" "}
                {dinero(h.precioNoche)}
              </option>
            ))}
          </select>
          {fechasValidas && libres.length === 0 && (
            <small className="text-danger">
              No hay habitaciones libres para esas fechas y esa cantidad de
              personas.
            </small>
          )}
        </div>

        <div>
          <label htmlFor="res-cliente" className="form-label">
            Nombre del huésped
          </label>
          <input
            id="res-cliente"
            className="form-control"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nombre y apellido"
          />
        </div>

        <div className="row g-3">
          <div className="col-6">
            <label htmlFor="res-doc" className="form-label">
              Documento
            </label>
            <input
              id="res-doc"
              className="form-control"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label htmlFor="res-tel" className="form-label">
              Teléfono
            </label>
            <input
              id="res-tel"
              type="tel"
              className="form-control"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
        </div>

        {editando ? (
          <small className="text-secondary">
            Pagado hasta ahora: {dinero(editando.anticipo)}. Los abonos se
            registran desde la reserva.
          </small>
        ) : (
          <div>
            <label htmlFor="res-anticipo" className="form-label">
              Anticipo (opcional)
            </label>
            <input
              id="res-anticipo"
              type="number"
              min="0"
              step="10000"
              className="form-control"
              value={anticipo}
              onChange={(e) => setAnticipo(e.target.value)}
              placeholder="0"
            />
          </div>
        )}

        <div>
          <label htmlFor="res-notas" className="form-label">
            Notas (opcional)
          </label>
          <textarea
            id="res-notas"
            rows={2}
            className="form-control"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Hora de llegada, peticiones..."
          />
        </div>

        {habitacion && (
          <div className="bg-light border rounded p-2 small">
            {noches} {noches === 1 ? "noche" : "noches"} × {dinero(precioNoche)}{" "}
            = <strong>{dinero(total)}</strong>
          </div>
        )}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1">
            {editando ? "Guardar cambios" : "Crear reserva"}
          </button>
          {editando && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancelar}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
