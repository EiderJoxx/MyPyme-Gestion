import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Inicio from "./pages/admin/Inicio";
import RestauranteBar from "./pages/admin/RestauranteBar";
import Hospedaje from "./pages/admin/Hospedaje";
import Administracion from "./pages/admin/Administracion";
import Usuarios from "./pages/admin/Usuarios";
import Ventas from "./pages/admin/Ventas";
import AuthProvider from "./auth/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Inicio />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="hospedaje" element={<Hospedaje />} />
            <Route path="restaurante" element={<RestauranteBar />} />
            <Route path="administracion" element={<Administracion />} />
            <Route path="usuarios" element={<Usuarios />} />

            {/* Rutas antiguas: redirigen a la sección unificada */}
            <Route
              path="habitaciones"
              element={<Navigate to="/admin/hospedaje" replace />}
            />
            <Route
              path="reservaciones"
              element={<Navigate to="/admin/hospedaje" replace />}
            />
            <Route
              path="restaurantebar"
              element={<Navigate to="/admin/restaurante" replace />}
            />
            <Route
              path="bar"
              element={<Navigate to="/admin/restaurante" replace />}
            />
            <Route
              path="inventario"
              element={<Navigate to="/admin/administracion" replace />}
            />
            <Route
              path="gastos"
              element={<Navigate to="/admin/administracion" replace />}
            />
            <Route
              path="reportes"
              element={<Navigate to="/admin/administracion" replace />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
