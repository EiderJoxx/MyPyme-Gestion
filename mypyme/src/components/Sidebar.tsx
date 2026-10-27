import { NavLink } from "react-router-dom";

const enlaces = [
  { ruta: "/admin", texto: "Inicio" },
  { ruta: "/admin/hospedaje", texto: "Hospedaje" },
  { ruta: "/admin/restaurantebar", texto: "Restaurante y Bar" },
  { ruta: "/admin/administracion", texto: "Administración" },
  { ruta: "/admin/sistemas", texto: "Sistema" },
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
