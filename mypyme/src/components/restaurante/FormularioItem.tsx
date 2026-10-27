import { useState } from "react";
import type { AreaMenu, ItemMenu } from "../../types";
import { AREAS, CATEGORIAS_MENU } from "../../data/constantes";
import { reducirImagen } from "../../utils/imagen";

interface Props {
  editando: ItemMenu | null;
  onGuardar: (datos: Omit<ItemMenu, "id">, id?: number) => void;
  onCancelar: () => void;
}

export default function FormularioItem({
  editando,
  onGuardar,
  onCancelar,
}: Props) {
  const [area, setArea] = useState<AreaMenu>(editando?.area ?? "Restaurante");
  const [categoria, setCategoria] = useState(
    editando?.categoria ?? CATEGORIAS_MENU[editando?.area ?? "Restaurante"][0],
  );
  const [nombre, setNombre] = useState(editando?.nombre ?? "");
  const [precio, setPrecio] = useState(editando ? String(editando.precio) : "");
  const [descripcion, setDescripcion] = useState(editando?.descripcion ?? "");
  const [foto, setFoto] = useState(editando?.foto ?? "");
  const [disponible, setDisponible] = useState(editando?.disponible ?? true);
  const [error, setError] = useState("");
  const [claveInput, setClaveInput] = useState(0);

  const categorias = CATEGORIAS_MENU[area].includes(categoria)
    ? CATEGORIAS_MENU[area]
    : [categoria, ...CATEGORIAS_MENU[area]];

  function cambiarArea(nueva: AreaMenu) {
    setArea(nueva);
    setCategoria(CATEGORIAS_MENU[nueva][0]);
  }

  async function alElegirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (!archivo.type.startsWith("image/"))
      return setError("El archivo debe ser una imagen");
    try {
      setFoto(await reducirImagen(archivo));
      setError("");
    } catch {
      setError("No se pudo cargar la imagen");
    }
  }

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    const valor = Number(precio);
    if (!nombre.trim()) return setError("Escribe el nombre");
    if (!valor || valor <= 0) return setError("Escribe un precio válido");

    onGuardar(
      {
        nombre: nombre.trim(),
        area,
        categoria,
        precio: valor,
        descripcion: descripcion.trim(),
        foto,
        disponible,
      },
      editando?.id,
    );

    if (!editando) {
      setNombre("");
      setPrecio("");
      setDescripcion("");
      setFoto("");
      setDisponible(true);
      setCategoria(CATEGORIAS_MENU[area][0]);
      setError("");
      setClaveInput((k) => k + 1);
    }
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">
          {editando ? "Editar producto" : "Agregar al menú"}
        </h2>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div>
          <p className="form-label mb-1">Área</p>
          <div className="btn-group w-100" role="group" aria-label="Área">
            {AREAS.map((a) => (
              <button
                key={a}
                type="button"
                className={
                  area === a ? "btn btn-primary" : "btn btn-outline-secondary"
                }
                onClick={() => cambiarArea(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="item-nombre" className="form-label">
            Nombre
          </label>
          <input
            id="item-nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={
              area === "Bar" ? "Ej: Mojito" : "Ej: Sancocho de pescado"
            }
          />
        </div>

        <div className="row g-3">
          <div className="col-6">
            <label htmlFor="item-categoria" className="form-label">
              Categoría
            </label>
            <select
              id="item-categoria"
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
            <label htmlFor="item-precio" className="form-label">
              Precio (COP)
            </label>
            <input
              id="item-precio"
              type="number"
              min="0"
              step="500"
              className="form-control"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="18000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="item-desc" className="form-label">
            Descripción
          </label>
          <textarea
            id="item-desc"
            rows={3}
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ingredientes, tamaño, detalles..."
          />
        </div>

        <div>
          <label htmlFor="item-foto" className="form-label">
            Foto (opcional)
          </label>
          <input
            key={claveInput}
            id="item-foto"
            type="file"
            accept="image/*"
            className="form-control"
            onChange={alElegirFoto}
          />
          {foto && (
            <div className="mt-2 d-flex align-items-end gap-2">
              <img
                src={foto}
                alt="Vista previa"
                className="img-thumbnail"
                style={{ height: 100, objectFit: "cover" }}
              />
              <button
                type="button"
                className="btn btn-link btn-sm text-danger p-0"
                onClick={() => {
                  setFoto("");
                  setClaveInput((k) => k + 1);
                }}
              >
                Quitar foto
              </button>
            </div>
          )}
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="item-disponible"
            checked={disponible}
            onChange={(e) => setDisponible(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="item-disponible">
            Disponible para pedir
          </label>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1">
            {editando ? "Guardar cambios" : "Agregar al menú"}
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
