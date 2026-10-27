import { useState } from "react";
import type { EstadoHabitacion, Habitacion } from "../../types";
import { ESTADOS_HABITACION, TIPOS_HABITACION } from "../../data/constantes";

interface Props {
  numerosExistentes: string[];
  onAgregar: (habitacion: Omit<Habitacion, "id">) => void;
}

export default function FormularioHabitacion({
  numerosExistentes,
  onAgregar,
}: Props) {
  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState(TIPOS_HABITACION[0]);
  const [capacidad, setCapacidad] = useState("2");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState<EstadoHabitacion>("Disponible");
  const [error, setError] = useState("");

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    const num = numero.trim();
    const cap = Number(capacidad);
    const pre = Number(precio);

    if (!num) return setError("Escribe el número de la habitación");
    if (numerosExistentes.includes(num))
      return setError(`La habitación ${num} ya existe`);
    if (!Number.isInteger(cap) || cap < 1)
      return setError("La capacidad debe ser al menos 1");
    if (!pre || pre <= 0) return setError("Escribe un precio válido");

    onAgregar({ numero: num, tipo, capacidad: cap, precioNoche: pre, estado });

    setNumero("");
    setPrecio("");
    setCapacidad("2");
    setTipo(TIPOS_HABITACION[0]);
    setEstado("Disponible");
    setError("");
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">Agregar habitación</h2>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div>
          <label htmlFor="numero" className="form-label">
            Número
          </label>
          <input
            id="numero"
            className="form-control"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Ej: 103"
          />
        </div>

        <div>
          <label htmlFor="tipo" className="form-label">
            Tipo
          </label>
          <select
            id="tipo"
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            {TIPOS_HABITACION.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="row g-3">
          <div className="col-6">
            <label htmlFor="capacidad" className="form-label">
              Capacidad
            </label>
            <input
              id="capacidad"
              type="number"
              min="1"
              className="form-control"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label htmlFor="precio" className="form-label">
              Precio por noche
            </label>
            <input
              id="precio"
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
          <label htmlFor="estado" className="form-label">
            Estado inicial
          </label>
          <select
            id="estado"
            className="form-select"
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoHabitacion)}
          >
            {ESTADOS_HABITACION.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Agregar habitación
        </button>
      </div>
    </form>
  );
}
