import { useState } from "react";
import type { EstadoOrden, Orden } from "../../types";
import { dinero } from "../../utils/formato";

interface Props {
  ordenes: Orden[];
  onCambiarEstado: (id: number, estado: EstadoOrden) => void;
}

const ESTADOS: EstadoOrden[] = ["Abierta", "Cerrada", "Anulada"];
const COLOR: Record<EstadoOrden, string> = {
  Abierta: "text-bg-warning",
  Cerrada: "text-bg-success",
  Anulada: "text-bg-secondary",
};

export const totalOrden = (o: Orden) =>
  o.items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

export default function ListaOrdenes({ ordenes, onCambiarEstado }: Props) {
  const [filtro, setFiltro] = useState<EstadoOrden>("Abierta");

  const visibles = ordenes
    .filter((o) => o.estado === filtro)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {ESTADOS.map((e) => (
          <button
            key={e}
            type="button"
            className={
              filtro === e
                ? "btn btn-sm btn-primary"
                : "btn btn-sm btn-outline-secondary"
            }
            onClick={() => setFiltro(e)}
          >
            {e}s ({ordenes.filter((o) => o.estado === e).length})
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <div className="alert alert-light border">
          No hay órdenes {filtro.toLowerCase()}s.
        </div>
      ) : (
        <div className="row g-3">
          {visibles.map((o) => (
            <div key={o.id} className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="h6 mb-0">Mesa {o.mesa}</h3>
                    <span className={`badge ${COLOR[o.estado]}`}>
                      {o.estado}
                    </span>
                  </div>
                  <p className="text-secondary small">
                    {new Date(o.fecha).toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <ul className="list-unstyled small mb-3">
                    {o.items.map((i) => (
                      <li
                        key={i.platoId}
                        className="d-flex justify-content-between"
                      >
                        <span>
                          {i.cantidad} × {i.nombre}
                        </span>
                        <span>{dinero(i.precio * i.cantidad)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between fw-semibold border-top pt-2 mb-3">
                    <span>Total</span>
                    <span>{dinero(totalOrden(o))}</span>
                  </div>

                  {o.estado === "Abierta" && (
                    <div className="d-flex gap-2 mt-auto">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => onCambiarEstado(o.id, "Cerrada")}
                      >
                        Cobrar y cerrar
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          if (
                            window.confirm(
                              `¿Anular la orden de la mesa ${o.mesa}?`,
                            )
                          ) {
                            onCambiarEstado(o.id, "Anulada");
                          }
                        }}
                      >
                        Anular
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
