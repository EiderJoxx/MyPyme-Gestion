import type { Bebida } from "../../types";

interface Props {
  bebida: Bebida;
  onEliminar: (id: number) => void;
}

export default function TarjetaBebida({ bebida, onEliminar }: Props) {
  return (
    <div className="card h-100 shadow-sm">
      {bebida.foto ? (
        <img
          src={bebida.foto}
          alt={bebida.nombre}
          className="card-img-top"
          style={{ height: 180, objectFit: "cover" }}
        />
      ) : (
        <div
          className="bg-light d-flex align-items-center justify-content-center fs-1"
          style={{ height: 180 }}
        >
          🍹
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h3 className="h6 mb-0">{bebida.nombre}</h3>
          <span className="badge text-bg-primary">
            ${bebida.precio.toLocaleString("es-CO")}
          </span>
        </div>

        <p className="text-secondary small mt-2 mb-3">
          {bebida.descripcion || "Sin descripción"}
        </p>

        <button
          className="btn btn-outline-danger btn-sm mt-auto align-self-start"
          onClick={() => {
            if (window.confirm(`¿Eliminar "${bebida.nombre}"?`))
              onEliminar(bebida.id);
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
