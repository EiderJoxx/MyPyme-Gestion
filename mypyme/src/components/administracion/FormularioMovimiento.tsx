import { useState } from "react";
import type { DatosMovimiento, Insumo, TipoMovimiento } from "../../types";
import { MOTIVOS_SALIDA } from "../../data/constantes";
import { dinero } from "../../utils/formato";

interface Props {
  insumo: Insumo;
  tipo: TipoMovimiento;
  onGuardar: (datos: DatosMovimiento) => void;
  onCancelar: () => void;
}

export default function FormularioMovimiento({
  insumo,
  tipo,
  onGuardar,
  onCancelar,
}: Props) {
  const [cantidad, setCantidad] = useState(
    tipo === "Ajuste" ? String(insumo.stock) : "",
  );
  const [costoTotal, setCostoTotal] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [motivo, setMotivo] = useState(MOTIVOS_SALIDA[0]);
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");

  const valor = Number(cantidad);
  const costo = Number(costoTotal);

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (cantidad === "" || valor < 0)
      return setError("Escribe una cantidad válida");
    if (tipo !== "Ajuste" && valor <= 0)
      return setError("La cantidad debe ser mayor a 0");
    if (tipo === "Salida" && valor > insumo.stock)
      return setError(`Solo hay ${insumo.stock} ${insumo.unidad} en stock`);
    if (tipo === "Ajuste" && valor === insumo.stock)
      return setError("El conteo coincide con el stock actual");
    if (costo < 0) return setError("El costo no puede ser negativo");

    let detalle = nota.trim();
    if (tipo === "Entrada")
      detalle = ["Compra", proveedor.trim(), nota.trim()]
        .filter(Boolean)
        .join(" · ");
    if (tipo === "Salida")
      detalle = nota.trim() ? `${motivo}: ${nota.trim()}` : motivo;
    if (tipo === "Ajuste") detalle = nota.trim() || "Conteo físico";

    onGuardar({
      cantidad: valor,
      costoTotal: costo,
      proveedor: proveedor.trim(),
      detalle,
    });
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <div>
          <h2 className="h5 mb-0">
            {tipo === "Ajuste" ? "Ajuste de stock" : `${tipo} de stock`}
          </h2>
          <small className="text-secondary">
            {insumo.nombre} · hay {insumo.stock} {insumo.unidad}
          </small>
        </div>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div>
          <label htmlFor="mov-cantidad" className="form-label">
            {tipo === "Ajuste"
              ? `Stock contado (${insumo.unidad})`
              : `Cantidad (${insumo.unidad})`}
          </label>
          <input
            id="mov-cantidad"
            type="number"
            min="0"
            step="any"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            autoFocus
          />
        </div>

        {tipo === "Entrada" && (
          <>
            <div>
              <label htmlFor="mov-costo" className="form-label">
                Costo total de la compra (opcional)
              </label>
              <input
                id="mov-costo"
                type="number"
                min="0"
                step="any"
                className="form-control"
                value={costoTotal}
                onChange={(e) => setCostoTotal(e.target.value)}
                placeholder="0"
              />
              {costo > 0 && valor > 0 && (
                <small className="text-secondary">
                  Costo por unidad: {dinero(Math.round(costo / valor))}. Se
                  registrará también como gasto.
                </small>
              )}
            </div>
            <div>
              <label htmlFor="mov-prov" className="form-label">
                Proveedor (opcional)
              </label>
              <input
                id="mov-prov"
                className="form-control"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
              />
            </div>
          </>
        )}

        {tipo === "Salida" && (
          <div>
            <label htmlFor="mov-motivo" className="form-label">
              Motivo
            </label>
            <select
              id="mov-motivo"
              className="form-select"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            >
              {MOTIVOS_SALIDA.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="mov-nota" className="form-label">
            Nota (opcional)
          </label>
          <input
            id="mov-nota"
            className="form-control"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1">
            Registrar {tipo.toLowerCase()}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
