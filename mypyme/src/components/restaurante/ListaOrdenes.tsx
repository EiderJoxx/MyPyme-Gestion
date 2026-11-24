import { useState } from "react";
import type { EstadoOrden, MetodoPago, Orden } from "../../types";
import { METODOS_PAGO } from "../../data/constantes";
import { dinero } from "../../utils/formato";

interface Props {
  ordenes: Orden[];
  onCobrar: (id: number, metodo: MetodoPago) => Promise<string | null>;
  onAnular: (id: number) => Promise<string | null>;
  puedeAnular?: boolean;
}

const ESTADOS: EstadoOrden[] = ["Abierta", "Cerrada", "Anulada"];
const COLOR: Record<EstadoOrden, string> = {
  Abierta: "text-bg-warning",
  Cerrada: "text-bg-success",
  Anulada: "text-bg-secondary",
};

export default function ListaOrdenes({
  ordenes,
  onCobrar,
  onAnular,
  puedeAnular = true,
}: Props) {
  const [filtro, setFiltro] = useState<EstadoOrden>("Abierta");
  const [metodos, setMetodos] = useState<Record<number, MetodoPago>>({});
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState<number | null>(null);

  const metodoDe = (id: number): MetodoPago => metodos[id] ?? "Efectivo";

  const visibles = ordenes
    .filter((o) => o.estado === filtro)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  async function ejecutar(id: number, accion: () => Promise<string | null>) {
    if (procesando !== null) return;
    setError("");
    setProcesando(id);
    const err = await accion();
    setProcesando(null);
    if (err) setError(err);
  }

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

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

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
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h3 className="h6 mb-0">Mesa {o.mesa}</h3>
                    <span className={`badge ${COLOR[o.estado]}`}>
                      {o.estado}
                    </span>
                  </div>
                  <p className="text-secondary small mb-2">
                    {new Date(o.fecha).toLocaleString("es-CO", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                  {o.vendedorNombre && (
                    <p className="small text-secondary mb-2">
                      Vendedor: {o.vendedorNombre}
                    </p>
                  )}

                  <ul className="list-unstyled small mb-2">
                    {o.detalles.map((d) => (
                      <li
                        key={d.id}
                        className="d-flex justify-content-between"
                      >
                        <span>
                          {d.area === "Bar" ? "🍹" : "🍽️"} {d.cantidad} ×{" "}
                          {d.itemMenuNombre ?? "Item eliminado"}
                        </span>
                        <span>{dinero(d.subtotal)}</span>
                      </li>
                    ))}
                  </ul>

                  {o.nota && (
                    <p className="small fst-italic text-secondary mb-2">
                      Nota: {o.nota}
                    </p>
                  )}

                  <div className="d-flex justify-content-between fw-semibold border-top pt-2 mb-3">
                    <span>Total</span>
                    <span>{dinero(o.total)}</span>
                  </div>

                  {o.estado === "Cerrada" && o.metodoPago && (
                    <p className="small text-secondary mb-0 mt-auto">
                      Pagada con {o.metodoPago.toLowerCase()}
                    </p>
                  )}

                  {o.estado === "Abierta" && (
                    <div className="mt-auto d-flex flex-column gap-2">
                      <select
                        className="form-select form-select-sm"
                        aria-label="Método de pago"
                        value={metodoDe(o.id)}
                        disabled={procesando !== null}
                        onChange={(e) =>
                          setMetodos({
                            ...metodos,
                            [o.id]: e.target.value as MetodoPago,
                          })
                        }
                      >
                        {METODOS_PAGO.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm flex-grow-1"
                          disabled={procesando !== null}
                          onClick={() =>
                            ejecutar(o.id, () =>
                              onCobrar(o.id, metodoDe(o.id)),
                            )
                          }
                        >
                          {procesando === o.id
                            ? "Procesando..."
                            : "Cobrar y cerrar"}
                        </button>
                        {puedeAnular && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            disabled={procesando !== null}
                            onClick={() => {
                              if (
                                window.confirm(
                                  `¿Anular la orden de la mesa ${o.mesa}?`,
                                )
                              ) {
                                void ejecutar(o.id, () => onAnular(o.id));
                              }
                            }}
                          >
                            Anular
                          </button>
                        )}
                      </div>
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