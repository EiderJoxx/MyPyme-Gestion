import { useState } from "react";
import type { EstadoHabitacion } from "../../types";
import { ESTADOS_HABITACION } from "../../data/constantes";
import { useHabitaciones } from "../../hooks/useHabitaciones";
import FormularioHabitacion from "../../components/habitaciones/FormularioHabitacion";
import TablaHabitaciones from "../../components/habitaciones/TablaHabitaciones";

type Filtro = "Todas" | EstadoHabitacion;

export default function Habitaciones() {
  const { habitaciones, agregar, cambiarEstado, eliminar } = useHabitaciones();
  const [filtro, setFiltro] = useState<Filtro>("Todas");

  const ordenadas = [...habitaciones].sort((a, b) =>
    a.numero.localeCompare(b.numero, undefined, { numeric: true }),
  );
  const visibles =
    filtro === "Todas"
      ? ordenadas
      : ordenadas.filter((h) => h.estado === filtro);

  function contar(f: Filtro) {
    return f === "Todas"
      ? habitaciones.length
      : habitaciones.filter((h) => h.estado === f).length;
  }

  const filtros: Filtro[] = ["Todas", ...ESTADOS_HABITACION];

  return (
    <div>
      <h1>Habitaciones</h1>
      <p className="text-secondary">
        Administra las habitaciones y su disponibilidad.
      </p>

      <div className="row g-4">
        <div className="col-lg-4">
          <FormularioHabitacion
            numerosExistentes={habitaciones.map((h) => h.numero)}
            onAgregar={agregar}
          />
        </div>

        <div className="col-lg-8">
          <div className="d-flex flex-wrap gap-2 mb-3">
            {filtros.map((f) => (
              <button
                key={f}
                type="button"
                className={
                  filtro === f
                    ? "btn btn-sm btn-primary"
                    : "btn btn-sm btn-outline-secondary"
                }
                onClick={() => setFiltro(f)}
              >
                {f} ({contar(f)})
              </button>
            ))}
          </div>

          <TablaHabitaciones
            habitaciones={visibles}
            onCambiarEstado={cambiarEstado}
            onEliminar={eliminar}
          />
        </div>
      </div>
    </div>
  );
}
