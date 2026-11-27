import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { puedeVer } from "../auth/permisos";

const ENLACES = [
  { ruta: "/admin", texto: "Inicio" },
  { ruta: "/admin/ventas", texto: "Punto de venta" },
  { ruta: "/admin/hospedaje", texto: "Hospedaje" },
  { ruta: "/admin/restaurante", texto: "Restaurante y Bar" },
  { ruta: "/admin/administracion", texto: "Administración" },
  { ruta: "/admin/usuarios", texto: "Usuarios" },
];

export default function Sidebar() {
  const { usuario, cerrarSesion } = useAuth();
  if (!usuario) return null;

  const esSuperAdmin = usuario.rol === "SuperAdmin";

  // Si es SuperAdmin, solo le mostramos la ruta de Usuarios. 
  // Si es cualquier otro, usamos la lógica de permisos normal.
  const visibles = ENLACES.filter((e) => {
    if (esSuperAdmin) {
      return e.ruta === "/admin/usuarios";
    }
    return puedeVer(usuario.rol, e.ruta);
  });

  return (
    <aside className="sidebar">
      <div className="text-center mb-4">
        <h2 className="sidebar-titulo mb-1">MyPyme</h2>
        {esSuperAdmin && (
          <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: "0.7rem" }}>
            CONSOLA DE SEGURIDAD
          </span>
        )}
      </div>

      <nav className="d-flex flex-column gap-1">
        {visibles.map((e) => (
          <NavLink
            key={e.ruta}
            to={e.ruta}
            end={e.ruta === "/admin"}
            className={({ isActive }) =>
              isActive ? "enlace activo" : "enlace"
            }
          >
            {e.texto === "Usuarios" && "👥 "}
            {e.texto === "Inicio" && "📊 "}
            {e.texto === "Punto de venta" && "🛒 "}
            {e.texto === "Hospedaje" && "🏨 "}
            {e.texto === "Restaurante y Bar" && "🍽️ "}
            {e.texto === "Administración" && "💼 "}
            {e.texto}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-usuario mt-auto pt-4 border-top border-secondary">
        <div className="fw-semibold text-truncate">{usuario.nombre}</div>
        <small className="text-warning">{usuario.rol}</small>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm w-100 mt-3"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}