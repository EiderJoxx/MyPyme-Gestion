import { useState } from "react";
import type { ItemOrden, Plato } from "../../types";
import { MESAS } from "../../data/constantes";
import { dinero } from "../../utils/formato";

interface Props {
  platos: Plato[];
  onCrear: (mesa: number, items: ItemOrden[]) => void;
}

export default function NuevaOrden({ platos, onCrear }: Props) {
  const [mesa, setMesa] = useState("");
  const [items, setItems] = useState<ItemOrden[]>([]);
  const [error, setError] = useState("");

  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

  function agregar(p: Plato) {
    setItems((prev) => {
      const existe = prev.find((i) => i.platoId === p.id);
      if (existe) {
        return prev.map((i) =>
          i.platoId === p.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        );
      }
      return [
        ...prev,
        { platoId: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 },
      ];
    });
  }

  function restar(platoId: number) {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.platoId !== platoId) return [i];
        return i.cantidad > 1 ? [{ ...i, cantidad: i.cantidad - 1 }] : [];
      }),
    );
  }

  function crear() {
    if (!mesa) return setError("Elige una mesa");
    if (items.length === 0) return setError("Agrega al menos un plato");
    onCrear(Number(mesa), items);
    setMesa("");
    setItems([]);
    setError("");
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">Nueva orden</h2>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div>
          <label htmlFor="orden-mesa" className="form-label">
            Mesa
          </label>
          <select
            id="orden-mesa"
            className="form-select"
            value={mesa}
            onChange={(e) => setMesa(e.target.value)}
          >
            <option value="">Selecciona una mesa</option>
            {MESAS.map((m) => (
              <option key={m} value={m}>
                Mesa {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="form-label mb-1">Platos</p>
          {platos.length === 0 ? (
            <div className="alert alert-light border mb-0">
              Primero agrega platos en la pestaña Menú.
            </div>
          ) : (
            <div
              className="list-group"
              style={{ maxHeight: 220, overflowY: "auto" }}
            >
              {platos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="list-group-item list-group-item-action d-flex justify-content-between"
                  onClick={() => agregar(p)}
                >
                  <span>{p.nombre}</span>
                  <span className="text-secondary">{dinero(p.precio)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="form-label mb-1">Pedido</p>
          {items.length === 0 ? (
            <p className="text-secondary small mb-0">
              Aún no hay platos en la orden.
            </p>
          ) : (
            <ul className="list-group">
              {items.map((i) => (
                <li
                  key={i.platoId}
                  className="list-group-item d-flex justify-content-between align-items-center gap-2"
                >
                  <span className="flex-grow-1">{i.nombre}</span>
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      aria-label={`Quitar uno de ${i.nombre}`}
                      onClick={() => restar(i.platoId)}
                    >
                      −
                    </button>
                    <span className="btn btn-light disabled">{i.cantidad}</span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      aria-label={`Agregar uno de ${i.nombre}`}
                      onClick={() =>
                        agregar({
                          id: i.platoId,
                          nombre: i.nombre,
                          precio: i.precio,
                        } as Plato)
                      }
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

        <div className="d-flex justify-content-between fs-5 fw-semibold">
          <span>Total</span>
          <span>{dinero(total)}</span>
        </div>

        <button type="button" className="btn btn-primary" onClick={crear}>
          Crear orden
        </button>
      </div>
    </div>
  );
}
