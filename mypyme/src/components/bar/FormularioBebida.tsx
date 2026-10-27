import { useState } from "react";
import type { Bebida } from "../../types";

interface Props {
  onAgregar: (bebida: Omit<Bebida, "id">) => void;
}

// Reduce la foto para que ocupe poco espacio al guardarla
function reducirImagen(archivo: File, maximo = 480): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error("No se pudo leer la imagen"));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Archivo de imagen no válido"));
      img.onload = () => {
        const escala = Math.min(1, maximo / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas
          .getContext("2d")!
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = lector.result as string;
    };
    lector.readAsDataURL(archivo);
  });
}

export default function FormularioBebida({ onAgregar }: Props) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState("");
  const [error, setError] = useState("");
  const [claveInput, setClaveInput] = useState(0);

  async function alElegirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }
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
    if (!nombre.trim()) return setError("Escribe el nombre de la bebida");
    if (!valor || valor <= 0) return setError("Escribe un precio válido");

    onAgregar({
      nombre: nombre.trim(),
      precio: valor,
      descripcion: descripcion.trim(),
      foto,
    });

    // Limpiar el formulario
    setNombre("");
    setPrecio("");
    setDescripcion("");
    setFoto("");
    setError("");
    setClaveInput((k) => k + 1); // reinicia el campo de archivo
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">Agregar bebida</h2>

        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

        <div>
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            id="nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Mojito"
          />
        </div>

        <div>
          <label htmlFor="precio" className="form-label">
            Precio (COP)
          </label>
          <input
            id="precio"
            type="number"
            min="0"
            step="100"
            className="form-control"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Ej: 18000"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <textarea
            id="descripcion"
            rows={3}
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ingredientes, tamaño, detalles..."
          />
        </div>

        <div>
          <label htmlFor="foto" className="form-label">
            Foto
          </label>
          <input
            key={claveInput}
            id="foto"
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
          Agregar bebida
        </button>
      </div>
    </form>
  );
}
