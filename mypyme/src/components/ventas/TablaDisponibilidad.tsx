import { useState } from "react";
import type { AreaMenu, Insumo, ItemMenu } from "../../types";
import { AREAS, COLOR_AREA } from "../../data/constantes";
import { dinero } from "../../utils/formato";
import { unidadesDisponibles } from "../../utils/disponibilidad";

interface Props {
  menu: ItemMenu[];
  insumos: Insumo[];
}

type FiltroArea = "Todas" | AreaMenu;

export default function TablaDisponibilidad({ menu, insumos }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [area, setArea] = useState<FiltroArea>("Todas");
  const texto = busqueda.toLowerCase();

  const productos = menu
    .filter((m) => area === "Todas" || m.area === area)
    .filter((m) => m.nombre.toLowerCase().includes(texto))
    .sort(
      (a, b) =>
        a.area.localeCompare(b.area) || a.nombre.localeCompare(b.nombre),
    );

  const existencias = insumos
    .filter((i) => i.nombre.toLowerCase().includes(texto))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-wrap gap-2">
        <input
          className="form-control form-control-sm"
          style={{ maxWidth: 240 }}
          placeholder="Buscar..."
          aria-label="Buscar disponibilidad"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 160 }}
          aria-label="Filtrar por área"
          value={area}
          onChange={(e) => setArea(e.target.value as FiltroArea)}
        >
          {["Todas", ...AREAS].map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="card shadow-sm">
        <div className="card-body pb-0">
          <h2 className="h6 mb-0">Productos del menú</h2>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Área</th>
                <th>Precio</th>
                <th>Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((m) => {
                const n = unidadesDisponibles(m, insumos);
                return (
                  <tr key={m.id}>
                    <td>{m.nombre}</td>
                    <td>
                      <span className={`badge ${COLOR_AREA[m.area]}`}>
                        {m.area}
                      </span>
                    </td>
                    <td>{dinero(m.precio)}</td>
                    <td>
                      {n === 0 && (
                        <span className="badge text-bg-danger">Agotado</span>
                      )}
                      {n === undefined && (
                        <span className="badge text-bg-success">
                          Disponible
                        </span>
                      )}
                      {n !== undefined && n > 0 && (
                        <span
                          className={
                            n <= 5
                              ? "badge text-bg-warning"
                              : "badge text-bg-success"
                          }
                        >
                          {n} unidades
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {productos.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-secondary text-center py-3">
                    No hay productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body pb-0">
          <h2 className="h6 mb-0">Existencias en bodega</h2>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {existencias.map((i) => (
                <tr key={i.id}>
                  <td>{i.nombre}</td>
                  <td className="text-secondary">{i.categoria}</td>
                  <td className="fw-semibold">
                    {i.stock} {i.unidad}
                  </td>
                  <td>
                    {i.stock <= 0 && (
                      <span className="badge text-bg-danger">Agotado</span>
                    )}
                    {i.stock > 0 && i.stock <= i.stockMinimo && (
                      <span className="badge text-bg-warning">Stock bajo</span>
                    )}
                    {i.stock > i.stockMinimo && (
                      <span className="badge text-bg-success">OK</span>
                    )}
                  </td>
                </tr>
              ))}
              {existencias.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-secondary text-center py-3">
                    No hay insumos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
