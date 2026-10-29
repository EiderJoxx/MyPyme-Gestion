import { useState } from "react";
import type { Gasto } from "../../types";
import { CATEGORIAS_GASTO } from "../../data/constantes";
import { hoyISO } from "../../utils/fechas";

interface Props {
  editando: Gasto | null;
  onGuardar: (datos: Omit<Gasto, "id">, id?: number) => void;
  onCancelar: () => void;
}

export default function FormularioGasto({
  editando,
  onGuardar,
  onCancelar,
}: Props) {
  const hoy = hoyISO();
  const [fecha, setFecha] = useState(editando?.fecha ?? hoy);
  const [categoria, setCategoria] = useState(
    editando?.categoria ?? CATEGORIAS_GASTO[0],
  );
  const [descripcion, setDescripcion] = useState(editando?.descripcion ?? "");
  const [proveedor, setProveedor] = useState(editando?.proveedor ?? "");
  const [monto, setMonto] = useState(editando ? String(editando.monto) : "");
  const [error, setError] = useState("");

  const categorias = CATEGORIAS_GASTO.includes(categoria)
    ? CATEGORIAS_GASTO
    : [categoria, ...CATEGORIAS_GASTO];

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    const valor = Number(monto);
    if (!fecha) return setError("Elige la fecha del gasto");
    if (!descripcion.trim()) return setError("Escribe una descripción");
    if (!valor || valor <= 0) return setError("Escribe un monto válido");

    onGuardar(
      {
        fecha,
        categoria,
        descripcion: descripcion.trim(),
        proveedor: proveedor.trim(),
        monto: valor,
      },
      editando?.id,
    );

    if (!editando) {
      setDescripcion("");
      setProveedor("");
      setMonto("");
      setError("");
    }
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">
          {editando ? "Editar gasto" : "Registrar gasto"}
        </h2>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div className="row g-3">
          <div className="col-6">
            <label htmlFor="gas-fecha" className="form-label">
              Fecha
            </label>
            <input
              id="gas-fecha"
              type="date"
              className="form-control"
              max={hoy}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label htmlFor="gas-monto" className="form-label">
              Monto (COP)
            </label>
            <input
              id="gas-monto"
              type="number"
              min="0"
              step="1000"
              className="form-control"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label htmlFor="gas-cat" className="form-label">
            Categoría
          </label>
          <select
            id="gas-cat"
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categorias.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="gas-desc" className="form-label">
            Descripción
          </label>
          <input
            id="gas-desc"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Pago de energía de octubre"
          />
        </div>

        <div>
          <label htmlFor="gas-prov" className="form-label">
            Proveedor (opcional)
          </label>
          <input
            id="gas-prov"
            className="form-control"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1">
            {editando ? "Guardar cambios" : "Registrar gasto"}
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
