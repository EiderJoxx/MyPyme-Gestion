import { useState } from "react";
import type { AreaMenu, ItemMenu, ItemOrden } from "../../types";
import { AREAS, COLOR_AREA, MESAS } from "../../data/constantes";
import { dinero } from "../../utils/formato";

interface Props {
  menu: ItemMenu[];
  mesa: number | null;
  mesasOcupadas: number[];
  onMesaChange: (mesa: number | null) => void;
  onGuardar: (mesa: number, items: ItemOrden[], nota: string) => void;
}

type FiltroArea = "Todas" | AreaMenu;

export default function NuevaOrden({
  menu,
  mesa,
  mesasOcupadas,
  onMesaChange,
  onGuardar,
}: Props) {
  const [items, setItems] = useState<ItemOrden[]>([]);
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [area, setArea] = useState<FiltroArea>("Todas");

  const opcionesArea: FiltroArea[] = ["Todas", ...AREAS];
  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
  const mesaOcupada = mesa !== null && mesasOcupadas.includes(mesa);

  const disponibles = menu
    .filter((m) => m.disponible)
    .filter((m) => area === "Todas" || m.area === area)
    .filter((m) => m.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  function agregar(m: ItemMenu) {
    setItems((prev) =>
      prev.some((i) => i.itemId === m.id)
        ? prev.map((i) =>
            i.itemId === m.id ? { ...i, cantidad: i.cantidad + 1 } : i,
          )
        : [
            ...prev,
            {
              itemId: m.id,
              nombre: m.nombre,
              area: m.area,
              precio: m.precio,
              cantidad: 1,
            },
          ],
    );
  }

  function cambiarCantidad(itemId: number, delta: number) {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.itemId !== itemId) return [i];
        const cantidad = i.cantidad + delta;
        return cantidad > 0 ? [{ ...i, cantidad }] : [];
      }),
    );
  }

  function guardar() {
    if (mesa === null) return setError("Elige una mesa");
    if (items.length === 0) return setError("Agrega al menos un producto");
    onGuardar(mesa, items, nota);
    setItems([]);
    setNota("");
    setError("");
    onMesaChange(null);
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">Tomar pedido</h2>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div>
          <p className="form-label mb-1">Mesa</p>
          <div className="d-flex flex-wrap gap-2">
            {MESAS.map((m) => {
              const clase =
                mesa === m
                  ? "btn btn-primary"
                  : mesasOcupadas.includes(m)
                    ? "btn btn-warning"
                    : "btn btn-outline-secondary";
              return (
                <button
                  key={m}
                  type="button"
                  className={clase}
                  style={{ width: 48 }}
                  aria-pressed={mesa === m}
                  onClick={() => onMesaChange(mesa === m ? null : m)}
                >
                  {m}
                </button>
              );
            })}
          </div>
          <small className="text-secondary">
            Amarillo: la mesa ya tiene una orden abierta.
          </small>
          {mesaOcupada && (
            <div className="alert alert-warning py-2 mt-2 mb-0">
              La mesa {mesa} ya tiene una orden abierta: los productos se
              agregarán a esa orden.
            </div>
          )}
        </div>

        <div>
          <p className="form-label mb-1">Productos</p>
          <div className="d-flex gap-2 mb-2">
            <input
              className="form-control form-control-sm"
              placeholder="Buscar..."
              aria-label="Buscar producto"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <select
              className="form-select form-select-sm"
              style={{ maxWidth: 140 }}
              aria-label="Filtrar por área"
              value={area}
              onChange={(e) => setArea(e.target.value as FiltroArea)}
            >
              {opcionesArea.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          {disponibles.length === 0 ? (
            <div className="alert alert-light border mb-0">
              No hay productos disponibles. Agrégalos en la pestaña Menú.
            </div>
          ) : (
            <div
              className="list-group"
              style={{ maxHeight: 220, overflowY: "auto" }}
            >
              {disponibles.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-2"
                  onClick={() => agregar(m)}
                >
                  <span>
                    {m.nombre}{" "}
                    <span className={`badge ${COLOR_AREA[m.area]}`}>
                      {m.area}
                    </span>
                  </span>
                  <span className="text-secondary">{dinero(m.precio)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="form-label mb-1">Pedido</p>
          {items.length === 0 ? (
            <p className="text-secondary small mb-0">
              Aún no hay productos en el pedido.
            </p>
          ) : (
            <ul className="list-group">
              {items.map((i) => (
                <li
                  key={i.itemId}
                  className="list-group-item d-flex justify-content-between align-items-center gap-2"
                >
                  <span className="flex-grow-1">{i.nombre}</span>
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      aria-label={`Quitar uno de ${i.nombre}`}
                      onClick={() => cambiarCantidad(i.itemId, -1)}
                    >
                      −
                    </button>
                    <span className="btn btn-light disabled">{i.cantidad}</span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      aria-label={`Agregar uno de ${i.nombre}`}
                      onClick={() => cambiarCantidad(i.itemId, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-end" style={{ minWidth: 80 }}>
                    {dinero(i.precio * i.cantidad)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label htmlFor="orden-nota" className="form-label">
            Nota (opcional)
          </label>
          <textarea
            id="orden-nota"
            rows={2}
            className="form-control"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: sin cebolla, bebida sin hielo"
          />
        </div>

        <div className="d-flex justify-content-between fs-5 fw-semibold">
          <span>Total</span>
          <span>{dinero(total)}</span>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary flex-grow-1"
            onClick={guardar}
          >
            {mesaOcupada ? "Agregar a la orden" : "Crear orden"}
          </button>
          {items.length > 0 && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setItems([])}
            >
              Vaciar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
