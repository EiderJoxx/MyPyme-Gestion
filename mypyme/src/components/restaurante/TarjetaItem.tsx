import type { ItemMenu } from "../../types";
import { COLOR_AREA } from "../../data/constantes";
import { dinero } from "../../utils/formato";

interface Props {
  item: ItemMenu;
  onEditar: (item: ItemMenu) => void;
  onEliminar: (id: number) => void;
  onCambiarDisponible: (id: number) => void;
}

export default function TarjetaItem({
  item,
  onEditar,
  onEliminar,
  onCambiarDisponible,
}: Props) {
  return (
    <div
      className={
        item.disponible
          ? "card h-100 shadow-sm"
          : "card h-100 shadow-sm opacity-75"
      }
    >
      <div className="position-relative">
        {item.foto ? (
          <img
            src={item.foto}
            alt={item.nombre}
            className="card-img-top"
            style={{ height: 150, objectFit: "cover" }}
          />
        ) : (
          <div
            className="bg-light d-flex align-items-center justify-content-center fs-1"
            style={{ height: 150 }}
          >
            {item.area === "Bar" ? "🍹" : "🍽️"}
          </div>
        )}
        <span
          className={`badge ${COLOR_AREA[item.area]} position-absolute top-0 start-0 m-2`}
        >
          {item.area}
        </span>
        {!item.disponible && (
          <span className="badge text-bg-dark position-absolute top-0 end-0 m-2">
            Agotado
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <small className="text-secondary">{item.categoria}</small>
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h3 className="h6 mb-0">{item.nombre}</h3>
          <span className="badge text-bg-primary">{dinero(item.precio)}</span>
        </div>
        <p className="text-secondary small mt-2 mb-3">
          {item.descripcion || "Sin descripción"}
        </p>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`disp-${item.id}`}
            checked={item.disponible}
            onChange={() => onCambiarDisponible(item.id)}
          />
          <label className="form-check-label small" htmlFor={`disp-${item.id}`}>
            Disponible
          </label>
        </div>

        <div className="d-flex gap-2 mt-auto">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onEditar(item)}
          >
            Editar
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              if (window.confirm(`¿Eliminar "${item.nombre}" del menú?`))
                onEliminar(item.id);
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
