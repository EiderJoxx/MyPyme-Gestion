import { NavLink } from "react-router-dom";

const enlaces = [
  { ruta: "/", texto: "Inicio" },
  { ruta: "/bar", texto: "Bar" },
  { ruta: "/habitaciones", texto: "Habitaciones" },
  { ruta: "/restaurante", texto: "Restaurante" },
  { ruta: "/reservaciones", texto: "Reservaciones" },
  { ruta: "/gastos", texto: "Gastos" },
  { ruta: "/usuarios", texto: "Usuarios" },
  { ruta: "/reportes", texto: "Reportes" },
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
            end={e.ruta === "/"}
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
