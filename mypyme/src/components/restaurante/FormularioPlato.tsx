import { useState } from "react";
import type { Plato } from "../../types";
import { CATEGORIAS_PLATO } from "../../data/constantes";
import { reducirImagen } from "../../utils/imagen";

interface Props {
  onAgregar: (plato: Omit<Plato, "id">) => void;
}

export default function FormularioPlato({ onAgregar }: Props) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_PLATO[0]);
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState("");
  const [error, setError] = useState("");
  const [claveInput, setClaveInput] = useState(0);

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
    if (!nombre.trim()) return setError("Escribe el nombre del plato");
    if (!valor || valor <= 0) return setError("Escribe un precio válido");

    onAgregar({
      nombre: nombre.trim(),
      categoria,
      precio: valor,
      descripcion: descripcion.trim(),
      foto,
    });

    setNombre("");
    setPrecio("");
    setDescripcion("");
    setFoto("");
    setCategoria(CATEGORIAS_PLATO[0]);
    setError("");
    setClaveInput((k) => k + 1);
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">Agregar plato</h2>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div>
          <label htmlFor="plato-nombre" className="form-label">
            Nombre
          </label>
          <input
            id="plato-nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Sancocho de pescado"
          />
        </div>

        <div className="row g-3">
          <div className="col-6">
            <label htmlFor="plato-categoria" className="form-label">
              Categoría
            </label>
            <select
              id="plato-categoria"
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {CATEGORIAS_PLATO.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label htmlFor="plato-precio" className="form-label">
              Precio (COP)
            </label>
            <input
              id="plato-precio"
              type="number"
              min="0"
              step="500"
              className="form-control"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="35000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="plato-desc" className="form-label">
            Descripción
          </label>
          <textarea
            id="plato-desc"
            rows={3}
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ingredientes, acompañamientos..."
          />
        </div>

        <div>
          <label htmlFor="plato-foto" className="form-label">
            Foto (opcional)
          </label>
          <input
            key={claveInput}
            id="plato-foto"
            type="file"
            accept="image/*"
            className="form-control"
            onChange={alElegirFoto}
          />
          {foto && (
            <img
              src={foto}
              alt="Vista previa"
              className="img-thumbnail mt-2"
              style={{ height: 120, objectFit: "cover" }}
            />
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Agregar plato
        </button>
      </div>
    </form>
  );
}
