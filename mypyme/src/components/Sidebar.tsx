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

  const visibles = ENLACES.filter((e) => puedeVer(usuario.rol, e.ruta));

  return (
    <aside className="sidebar">
      <h2 className="sidebar-titulo">MyPyme</h2>

      <nav>
        {visibles.map((e) => (
          <NavLink
            key={e.ruta}
            to={e.ruta}
            end={e.ruta === "/admin"}
            className={({ isActive }) =>
              isActive ? "enlace activo" : "enlace"
            }
          >
            {e.texto}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-usuario">
        <div className="fw-semibold text-truncate">{usuario.nombre}</div>
        <small>{usuario.rol}</small>
        <button
          type="button"
          className="btn btn-outline-light btn-sm w-100 mt-2"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

/* import { NavLink } from "react-router-dom";

const enlaces = [
  { ruta: "/admin", texto: "Inicio" },
  { ruta: "/admin/hospedaje", texto: "Hospedaje" },
  { ruta: "/admin/restaurantebar", texto: "Restaurante y Bar" },
  { ruta: "/admin/administracion", texto: "Administración" },
  { ruta: "/admin/usua", texto: "Sistema" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-titulo">MyPyme</h2>
      <nav>
        {enlaces.map((e) => (
          <NavLink
            key={e.ruta}
            to={e.ruta}
            end={e.ruta === "/admin"}
            className={({ isActive }) =>
              isActive ? "enlace activo" : "enlace"
            }
          >
            {e.texto}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
 */
