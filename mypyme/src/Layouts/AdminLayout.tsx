import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/useAuth";
import { puedeVer, RUTA_INICIAL } from "../auth/permisos";

export default function AdminLayout() {
  const { usuario } = useAuth();
  const { pathname } = useLocation();

  if (!usuario) return <Navigate to="/login" replace />;
  if (!puedeVer(usuario.rol, pathname))
    return <Navigate to={RUTA_INICIAL[usuario.rol]} replace />;

  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-4" style={{ minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}

/* import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-4" style={{ minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
 */
