import type { EstadoHabitacion, Habitacion, Reserva } from "../../types";
import { ESTADOS_HABITACION } from "../../data/constantes";
import { dinero } from "../../utils/formato";
import { formatoFecha, hoyISO } from "../../utils/fechas";
import { ocupacionDe } from "../../utils/reservas";

interface Props {
  habitaciones: Habitacion[];
  reservas: Reserva[];
  onEditar: (h: Habitacion) => void;
  onCambiarEstado: (id: number, estado: EstadoHabitacion) => void;
  onEliminar: (h: Habitacion) => void;
}

const COLOR: Record<EstadoHabitacion, string> = {
  Disponible: "text-bg-success",
  Ocupada: "text-bg-danger",
  Limpieza: "text-bg-warning",
  Mantenimiento: "text-bg-secondary",
};

export default function TablaHabitaciones({
  habitaciones,
  reservas,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: Props) {
  const hoy = hoyISO();

  if (habitaciones.length === 0) {
    return (
      <div className="alert alert-light border">
        No hay habitaciones para mostrar.
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Hab.</th>
              <th>Tipo</th>
              <th>Capacidad</th>
              <th>Precio / noche</th>
              <th>Estado</th>
              <th>Huésped / próxima reserva</th>
              <th>Cambiar estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((h) => {
              const o = ocupacionDe(h.id, reservas, hoy);
              return (
                <tr key={h.id}>
                  <td className="fw-semibold">{h.numero}</td>
                  <td>{h.tipo}</td>
                  <td>{h.capacidad}</td>
                  <td>{dinero(h.precioNoche)}</td>
                  <td>
                    <span className={`badge ${COLOR[h.estado]}`}>
                      {h.estado}
                    </span>
                  </td>
                  <td className="small">
                    {o?.tipo === "enCasa" && (
                      <span>
                        {o.reserva.cliente}{" "}
                        <span className="text-secondary">
                          hasta {formatoFecha(o.reserva.checkOut)}
                        </span>
                      </span>
                    )}
                    {o?.tipo === "proxima" && (
                      <span className="text-secondary">
                        Próxima: {o.reserva.cliente} (
                        {formatoFecha(o.reserva.checkIn)})
                      </span>
                    )}
                    {!o && <span className="text-secondary">—</span>}
                  </td>
                  <td style={{ minWidth: 150 }}>
                    <select
                      className="form-select form-select-sm"
                      value={h.estado}
                      aria-label={`Cambiar estado de la habitación ${h.numero}`}
                      onChange={(e) =>
                        onCambiarEstado(
                          h.id,
                          e.target.value as EstadoHabitacion,
                        )
                      }
                    >
                      {ESTADOS_HABITACION.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="text-end text-nowrap">
                    <button
                      className="btn btn-outline-secondary btn-sm me-1"
                      onClick={() => onEditar(h)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onEliminar(h)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
