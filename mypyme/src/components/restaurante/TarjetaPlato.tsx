import type { Plato } from "../../types";
import { dinero } from "../../utils/formato";

interface Props {
  plato: Plato;
  onEliminar: (id: number) => void;
}

export default function TarjetaPlato({ plato, onEliminar }: Props) {
  return (
    <div className="card h-100 shadow-sm">
      {plato.foto ? (
        <img
          src={plato.foto}
          alt={plato.nombre}
          className="card-img-top"
          style={{ height: 160, objectFit: "cover" }}
        />
      ) : (
        <div
          className="bg-light d-flex align-items-center justify-content-center fs-1"
          style={{ height: 160 }}
        >
          🍽️
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-light border align-self-start mb-2">
          {plato.categoria}
        </span>
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h3 className="h6 mb-0">{plato.nombre}</h3>
          <span className="badge text-bg-primary">{dinero(plato.precio)}</span>
        </div>
        <p className="text-secondary small mt-2 mb-3">
          {plato.descripcion || "Sin descripción"}
        </p>

        <button
          className="btn btn-outline-danger btn-sm mt-auto align-self-start"
          onClick={() => {
            if (window.confirm(`¿Eliminar "${plato.nombre}" del menú?`))
              onEliminar(plato.id);
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
