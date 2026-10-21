import { NavLink } from "react-router-dom";

const enlaces = [
  { ruta: "/admin", texto: "Inicio" },
  { ruta: "/admin/bar", texto: "Bar" },
  { ruta: "/admin/habitaciones", texto: "Habitaciones" },
  { ruta: "/admin/restaurante", texto: "Restaurante" },
  { ruta: "/admin/reservaciones", texto: "Reservaciones" },
  { ruta: "/admin/gastos", texto: "Gastos" },
  { ruta: "/admin/usuarios", texto: "Usuarios" },
  { ruta: "/admin/reportes", texto: "Reportes" },
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
