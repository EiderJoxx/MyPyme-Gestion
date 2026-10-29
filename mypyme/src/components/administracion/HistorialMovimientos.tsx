import type { MovimientoInventario, TipoMovimiento } from "../../types";

interface Props {
  movimientos: MovimientoInventario[];
}

const COLOR: Record<TipoMovimiento, string> = {
  Entrada: "text-bg-success",
  Salida: "text-bg-warning",
  Ajuste: "text-bg-secondary",
};

export default function HistorialMovimientos({ movimientos }: Props) {
  const recientes = [...movimientos]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 10);

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h2 className="h6">Últimos movimientos</h2>
        {recientes.length === 0 ? (
          <p className="text-secondary small mb-0">
            Aún no hay movimientos de inventario.
          </p>
        ) : (
          <ul className="list-group list-group-flush">
            {recientes.map((m) => (
              <li
                key={m.id}
                className="list-group-item d-flex justify-content-between align-items-center gap-2 px-0"
              >
                <div>
                  <span className={`badge ${COLOR[m.tipo]} me-2`}>
                    {m.tipo}
                  </span>
                  <strong>{m.nombreInsumo}</strong>
                  <div className="small text-secondary">
                    {new Date(m.fecha).toLocaleString("es-CO", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                    {m.detalle && ` · ${m.detalle}`}
                  </div>
                </div>
                <span
                  className={
                    m.cantidad < 0
                      ? "text-danger fw-semibold"
                      : "text-success fw-semibold"
                  }
                >
                  {m.cantidad > 0 ? "+" : ""}
                  {m.cantidad}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
