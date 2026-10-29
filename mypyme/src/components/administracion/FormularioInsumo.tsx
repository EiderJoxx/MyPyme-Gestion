import { useState } from "react";
import type { Insumo, ItemMenu } from "../../types";
import { CATEGORIAS_INSUMO, UNIDADES } from "../../data/constantes";

interface Props {
  editando: Insumo | null;
  menu: ItemMenu[];
  nombresExistentes: string[];
  onGuardar: (datos: Omit<Insumo, "id">, id?: number) => void;
  onCancelar: () => void;
}

export default function FormularioInsumo({
  editando,
  menu,
  nombresExistentes,
  onGuardar,
  onCancelar,
}: Props) {
  const [nombre, setNombre] = useState(editando?.nombre ?? "");
  const [categoria, setCategoria] = useState(
    editando?.categoria ?? CATEGORIAS_INSUMO[0],
  );
  const [unidad, setUnidad] = useState(editando?.unidad ?? UNIDADES[0]);
  const [stock, setStock] = useState("0");
  const [stockMinimo, setStockMinimo] = useState(
    editando ? String(editando.stockMinimo) : "0",
  );
  const [costo, setCosto] = useState(
    editando ? String(editando.costoUnitario) : "",
  );
  const [itemMenuId, setItemMenuId] = useState(
    editando?.itemMenuId !== undefined ? String(editando.itemMenuId) : "",
  );
  const [consumo, setConsumo] = useState(
    editando ? String(editando.consumoPorVenta) : "1",
  );
  const [error, setError] = useState("");

  const menuOrdenado = [...menu].sort(
    (a, b) => a.area.localeCompare(b.area) || a.nombre.localeCompare(b.nombre),
  );
  const unidades = UNIDADES.includes(unidad) ? UNIDADES : [unidad, ...UNIDADES];
  const categorias = CATEGORIAS_INSUMO.includes(categoria)
    ? CATEGORIAS_INSUMO
    : [categoria, ...CATEGORIAS_INSUMO];

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    const nom = nombre.trim();
    const inicial = Number(stock);
    const minimo = Number(stockMinimo);
    const costoUnit = Number(costo);
    const cons = Number(consumo);

    if (!nom) return setError("Escribe el nombre del insumo");
    if (
      nombresExistentes
        .filter((n) => n !== editando?.nombre)
        .some((n) => n.toLowerCase() === nom.toLowerCase())
    ) {
      return setError("Ya existe un insumo con ese nombre");
    }
    if (minimo < 0 || costoUnit < 0 || (!editando && inicial < 0))
      return setError("Los valores no pueden ser negativos");
    if (itemMenuId && !(cons > 0))
      return setError("El descuento por venta debe ser mayor a 0");

    onGuardar(
      {
        nombre: nom,
        categoria,
        unidad,
        stock: editando ? editando.stock : inicial,
        stockMinimo: minimo,
        costoUnitario: costoUnit,
        itemMenuId: itemMenuId ? Number(itemMenuId) : undefined,
        consumoPorVenta: itemMenuId ? cons : 1,
      },
      editando?.id,
    );

    if (!editando) {
      setNombre("");
      setStock("0");
      setStockMinimo("0");
      setCosto("");
      setItemMenuId("");
      setConsumo("1");
      setError("");
    }
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">
          {editando ? "Editar insumo" : "Agregar insumo"}
        </h2>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div>
          <label htmlFor="ins-nombre" className="form-label">
            Nombre
          </label>
          <input
            id="ins-nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Ron blanco"
          />
        </div>

        <div className="row g-3">
          <div className="col-6">
            <label htmlFor="ins-cat" className="form-label">
              Categoría
            </label>
            <select
              id="ins-cat"
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {categorias.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label htmlFor="ins-unidad" className="form-label">
              Unidad
            </label>
            <select
              id="ins-unidad"
              className="form-select"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
            >
              {unidades.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-6">
            {editando ? (
              <>
                <p className="form-label mb-1">Stock actual</p>
                <p className="mb-0 fw-semibold">
                  {editando.stock} {editando.unidad}
                </p>
                <small className="text-secondary">
                  Cámbialo con Entrada, Salida o Ajuste.
                </small>
              </>
            ) : (
              <>
                <label htmlFor="ins-stock" className="form-label">
                  Stock inicial
                </label>
                <input
                  id="ins-stock"
                  type="number"
                  min="0"
                  step="any"
                  className="form-control"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </>
            )}
          </div>
          <div className="col-6">
            <label htmlFor="ins-min" className="form-label">
              Stock mínimo
            </label>
            <input
              id="ins-min"
              type="number"
              min="0"
              step="any"
              className="form-control"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="ins-costo" className="form-label">
            Costo por unidad (COP)
          </label>
          <input
            id="ins-costo"
            type="number"
            min="0"
            step="any"
            className="form-control"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="ins-menu" className="form-label">
            Descontar al vender (opcional)
          </label>
          <select
            id="ins-menu"
            className="form-select"
            value={itemMenuId}
            onChange={(e) => setItemMenuId(e.target.value)}
          >
            <option value="">No se descuenta automáticamente</option>
            {menuOrdenado.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} ({m.area})
              </option>
            ))}
          </select>
        </div>

        {itemMenuId && (
          <div>
            <label htmlFor="ins-consumo" className="form-label">
              Cantidad que se descuenta por cada venta
            </label>
            <input
              id="ins-consumo"
              type="number"
              min="0"
              step="any"
              className="form-control"
              value={consumo}
              onChange={(e) => setConsumo(e.target.value)}
            />
            <small className="text-secondary">
              Ej: 1 botella por cada cerveza vendida.
            </small>
          </div>
        )}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1">
            {editando ? "Guardar cambios" : "Agregar insumo"}
          </button>
          {editando && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancelar}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
