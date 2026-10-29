import { useState } from "react";
import type { EstadoHabitacion, Habitacion } from "../../types";
import { ESTADOS_HABITACION, TIPOS_HABITACION } from "../../data/constantes";

interface Props {
  editando: Habitacion | null;
  numerosExistentes: string[];
  onGuardar: (datos: Omit<Habitacion, "id">, id?: number) => void;
  onCancelar: () => void;
}

export default function FormularioHabitacion({
  editando,
  numerosExistentes,
  onGuardar,
  onCancelar,
}: Props) {
  const [numero, setNumero] = useState(editando?.numero ?? "");
  const [tipo, setTipo] = useState(editando?.tipo ?? TIPOS_HABITACION[0]);
  const [capacidad, setCapacidad] = useState(
    editando ? String(editando.capacidad) : "2",
  );
  const [precio, setPrecio] = useState(
    editando ? String(editando.precioNoche) : "",
  );
  const [estado, setEstado] = useState<EstadoHabitacion>(
    editando?.estado ?? "Disponible",
  );
  const [error, setError] = useState("");

  const tipos = TIPOS_HABITACION.includes(tipo)
    ? TIPOS_HABITACION
    : [tipo, ...TIPOS_HABITACION];

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    const num = numero.trim();
    const cap = Number(capacidad);
    const pre = Number(precio);

    if (!num) return setError("Escribe el número de la habitación");
    if (numerosExistentes.filter((n) => n !== editando?.numero).includes(num)) {
      return setError(`La habitación ${num} ya existe`);
    }
    if (!Number.isInteger(cap) || cap < 1)
      return setError("La capacidad debe ser al menos 1");
    if (!pre || pre <= 0) return setError("Escribe un precio válido");

    onGuardar(
      { numero: num, tipo, capacidad: cap, precioNoche: pre, estado },
      editando?.id,
    );

    if (!editando) {
      setNumero("");
      setPrecio("");
      setCapacidad("2");
      setTipo(TIPOS_HABITACION[0]);
      setEstado("Disponible");
      setError("");
    }
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">
          {editando
            ? `Editar habitación ${editando.numero}`
            : "Agregar habitación"}
        </h2>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div>
          <label htmlFor="hab-numero" className="form-label">
            Número
          </label>
          <input
            id="hab-numero"
            className="form-control"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Ej: 103"
          />
        </div>

        <div>
          <label htmlFor="hab-tipo" className="form-label">
            Tipo
          </label>
          <select
            id="hab-tipo"
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            {tipos.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="row g-3">
          <div className="col-6">
            <label htmlFor="hab-capacidad" className="form-label">
              Capacidad
            </label>
            <input
              id="hab-capacidad"
              type="number"
              min="1"
              className="form-control"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label htmlFor="hab-precio" className="form-label">
              Precio por noche
            </label>
            <input
              id="hab-precio"
              type="number"
              min="0"
              step="1000"
              className="form-control"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="150000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="hab-estado" className="form-label">
            Estado
          </label>
          <select
            id="hab-estado"
            className="form-select"
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoHabitacion)}
          >
            {ESTADOS_HABITACION.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {editando && (
          <small className="text-secondary">
            Cambiar el precio no afecta las reservas que ya existen: conservan
            el precio con el que se hicieron.
          </small>
        )}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1">
            {editando ? "Guardar cambios" : "Agregar habitación"}
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
