import { useState } from "react";
import type { Gasto } from "../../types";
import { CATEGORIAS_GASTO } from "../../data/constantes";
import { dinero } from "../../utils/formato";
import { formatoFecha } from "../../utils/fechas";
import { PERIODOS, rangoDe, type Periodo } from "../../utils/finanzas";
import BarraProgreso from "./BarraProgreso";

interface Props {
  gastos: Gasto[];
  onEditar: (g: Gasto) => void;
  onEliminar: (g: Gasto) => void;
}

export default function ListaGastos({ gastos, onEditar, onEliminar }: Props) {
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  const { desde, hasta } = rangoDe(periodo);
  const texto = busqueda.toLowerCase();

  const visibles = gastos
    .filter((g) => g.fecha >= desde && g.fecha <= hasta)
    .filter((g) => categoria === "Todas" || g.categoria === categoria)
    .filter(
      (g) =>
        g.descripcion.toLowerCase().includes(texto) ||
        g.proveedor.toLowerCase().includes(texto),
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const total = visibles.reduce((suma, g) => suma + g.monto, 0);
  const porCategoria = Array.from(
    visibles.reduce(
      (mapa, g) =>
        mapa.set(g.categoria, (mapa.get(g.categoria) ?? 0) + g.monto),
      new Map<string, number>(),
    ),
    ([nombre, monto]) => ({ nombre, monto }),
  ).sort((a, b) => b.monto - a.monto);

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        {PERIODOS.map((p) => (
          <button
            key={p.valor}
            type="button"
            className={
              periodo === p.valor
                ? "btn btn-sm btn-primary"
                : "btn btn-sm btn-outline-secondary"
            }
            onClick={() => setPeriodo(p.valor)}
          >
            {p.etiqueta}
          </button>
        ))}
      </div>

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 220 }}
          aria-label="Filtrar por categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          {["Todas", ...CATEGORIAS_GASTO].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          className="form-control form-control-sm"
          style={{ maxWidth: 240 }}
          placeholder="Buscar gasto o proveedor..."
          aria-label="Buscar gasto"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <strong className="ms-auto">Total: {dinero(total)}</strong>
      </div>

      {porCategoria.length > 0 && (
        <div className="card shadow-sm mb-3">
          <div className="card-body pb-1">
            {porCategoria.map((c) => (
              <BarraProgreso
                key={c.nombre}
                etiqueta={c.nombre}
                valor={c.monto}
                total={total}
                color="bg-danger"
              />
            ))}
          </div>
        </div>
      )}

      {visibles.length === 0 ? (
        <div className="alert alert-light border">
          No hay gastos en este período.
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Proveedor</th>
                  <th className="text-end">Monto</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((g) => (
                  <tr key={g.id}>
                    <td className="text-nowrap">{formatoFecha(g.fecha)}</td>
                    <td>
                      <span className="badge text-bg-light border">
                        {g.categoria}
                      </span>
                    </td>
                    <td>{g.descripcion}</td>
                    <td className="text-secondary">{g.proveedor || "—"}</td>
                    <td className="text-end fw-semibold">{dinero(g.monto)}</td>
                    <td className="text-end text-nowrap">
                      <button
                        className="btn btn-outline-secondary btn-sm me-1"
                        onClick={() => onEditar(g)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onEliminar(g)}
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
      )}
    </div>
  );
}
