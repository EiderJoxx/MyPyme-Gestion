import { Link, NavLink } from "react-router-dom";

const Enlaces = [
  { ruta: "/", texto: "Inicio" },
  { ruta: "/habitaciones", texto: "Habitaciones" },
  { ruta: "/restaurante", texto: "Restaurante" },
  { ruta: "/reservaciones", texto: "Reservaciones" },
  { ruta: "/reportes", texto: "Reportes" },
];

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        M
      </Link>

      <nav className="header-nav">
        {Enlaces.map((e) => (
          <NavLink
            key={e.ruta}
            to={e.ruta}
            end={e.ruta === "/"}
            className={({ isActive }) =>
              isActive ? "header-enlace activo" : "header-enlace"
            }
          >
            {e.texto}
          </NavLink>
        ))}
      </nav>

      <div className="header-botones">
        <button className="btn btn-contorno">Iniciar Sesión</button>
        <button className="btn btn-primario">Registrarse</button>
      </div>
    </header>
  );
}
