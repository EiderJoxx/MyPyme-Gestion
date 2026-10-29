import { useState } from "react";
import type { Insumo, ItemMenu, TipoMovimiento } from "../../types";
import { CATEGORIAS_INSUMO } from "../../data/constantes";
import { dinero } from "../../utils/formato";

interface Props {
  insumos: Insumo[];
  menu: ItemMenu[];
  onMovimiento: (insumo: Insumo, tipo: TipoMovimiento) => void;
  onEditar: (insumo: Insumo) => void;
  onEliminar: (insumo: Insumo) => void;
}

function estadoDe(i: Insumo) {
  if (i.stock <= 0) return { texto: "Agotado", clase: "text-bg-danger" };
  if (i.stock <= i.stockMinimo)
    return { texto: "Stock bajo", clase: "text-bg-warning" };
  return { texto: "OK", clase: "text-bg-success" };
}

export default function TablaInventario({
  insumos,
  menu,
  onMovimiento,
  onEditar,
  onEliminar,
}: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [soloBajos, setSoloBajos] = useState(false);

  const visibles = insumos
    .filter((i) => i.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((i) => categoria === "Todas" || i.categoria === categoria)
    .filter((i) => !soloBajos || i.stock <= i.stockMinimo)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  const nombreMenu = (id?: number) =>
    menu.find((m) => m.id === id)?.nombre ?? "producto del menú";

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <input
          className="form-control form-control-sm"
          style={{ maxWidth: 220 }}
          placeholder="Buscar insumo..."
          aria-label="Buscar insumo"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 200 }}
          aria-label="Filtrar por categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          {["Todas", ...CATEGORIAS_INSUMO].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="form-check ms-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="solo-bajos"
            checked={soloBajos}
            onChange={(e) => setSoloBajos(e.target.checked)}
          />
          <label className="form-check-label small" htmlFor="solo-bajos">
            Solo stock bajo
          </label>
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="alert alert-light border">
          No hay insumos con estos filtros.
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Insumo</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                  <th>Costo</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((i) => {
                  const estado = estadoDe(i);
                  return (
                    <tr key={i.id}>
                      <td>
                        <div className="fw-semibold">{i.nombre}</div>
                        <small className="text-secondary">{i.categoria}</small>
                        {i.itemMenuId !== undefined && (
                          <div className="small text-secondary">
                            ↔ {nombreMenu(i.itemMenuId)} (−{i.consumoPorVenta}{" "}
                            por venta)
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">
                        {i.stock} {i.unidad}
                      </td>
                      <td>{i.stockMinimo}</td>
                      <td>{dinero(i.costoUnitario)}</td>
                      <td>{dinero(Math.round(i.stock * i.costoUnitario))}</td>
                      <td>
                        <span className={`badge ${estado.clase}`}>
                          {estado.texto}
                        </span>
                      </td>
                      <td className="text-end text-nowrap">
                        <div className="btn-group btn-group-sm me-1">
                          <button
                            className="btn btn-outline-success"
                            onClick={() => onMovimiento(i, "Entrada")}
                          >
                            Entrada
                          </button>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => onMovimiento(i, "Salida")}
                          >
                            Salida
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => onMovimiento(i, "Ajuste")}
                          >
                            Ajuste
                          </button>
                        </div>
                        <button
                          className="btn btn-outline-secondary btn-sm me-1"
                          onClick={() => onEditar(i)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onEliminar(i)}
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
      )}
    </div>
  );
}
