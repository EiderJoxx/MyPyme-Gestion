import type { EstadoHabitacion, Habitacion } from "../../types";
import { ESTADOS_HABITACION } from "../../data/constantes";

interface Props {
  habitaciones: Habitacion[];
  onCambiarEstado: (id: number, estado: EstadoHabitacion) => void;
  onEliminar: (id: number) => void;
}

const COLOR: Record<EstadoHabitacion, string> = {
  Disponible: "text-bg-success",
  Ocupada: "text-bg-danger",
  Limpieza: "text-bg-warning",
  Mantenimiento: "text-bg-secondary",
};

export default function TablaHabitaciones({
  habitaciones,
  onCambiarEstado,
  onEliminar,
}: Props) {
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
              <th>Habitación</th>
              <th>Tipo</th>
              <th>Capacidad</th>
              <th>Precio / noche</th>
              <th>Estado</th>
              <th>Cambiar estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((h) => (
              <tr key={h.id}>
                <td className="fw-semibold">{h.numero}</td>
                <td>{h.tipo}</td>
                <td>
                  {h.capacidad} {h.capacidad === 1 ? "persona" : "personas"}
                </td>
                <td>${h.precioNoche.toLocaleString("es-CO")}</td>
                <td>
                  <span className={`badge ${COLOR[h.estado]}`}>{h.estado}</span>
                </td>
                <td style={{ minWidth: 150 }}>
                  <select
                    className="form-select form-select-sm"
                    value={h.estado}
                    aria-label={`Cambiar estado de la habitación ${h.numero}`}
                    onChange={(e) =>
                      onCambiarEstado(h.id, e.target.value as EstadoHabitacion)
                    }
                  >
                    {ESTADOS_HABITACION.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      if (
                        window.confirm(`¿Eliminar la habitación ${h.numero}?`)
                      )
                        onEliminar(h.id);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
