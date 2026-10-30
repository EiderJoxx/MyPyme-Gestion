import type { Usuario } from "../../types";

interface Props {
  usuarios: Usuario[];
  actualId: number | undefined;
  onEditar: (u: Usuario) => void;
  onEliminar: (u: Usuario) => void;
}

export default function TablaUsuarios({
  usuarios,
  actualId,
  onEditar,
  onEliminar,
}: Props) {
  const ordenados = [...usuarios].sort((a, b) =>
    a.nombre.localeCompare(b.nombre),
  );

  return (
    <div className="card shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Creado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((u) => (
              <tr key={u.id}>
                <td className="fw-semibold">
                  {u.nombre}{" "}
                  {u.id === actualId && (
                    <span className="badge text-bg-light border">Tú</span>
                  )}
                </td>
                <td>{u.usuario}</td>
                <td>
                  <span
                    className={
                      u.rol === "Administrador"
                        ? "badge text-bg-dark"
                        : "badge text-bg-info"
                    }
                  >
                    {u.rol}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      u.activo
                        ? "badge text-bg-success"
                        : "badge text-bg-secondary"
                    }
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="small text-secondary">
                  {new Date(u.creado).toLocaleDateString("es-CO")}
                </td>
                <td className="text-end text-nowrap">
                  <button
                    className="btn btn-outline-secondary btn-sm me-1"
                    onClick={() => onEditar(u)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onEliminar(u)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
