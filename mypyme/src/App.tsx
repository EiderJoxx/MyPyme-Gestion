import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Inicio from "./pages/admin/Inicio";
import Bar from "./pages/admin/Bar";
import Gastos from "./pages/admin/Gastos";
import Habitaciones from "./pages/admin/Habitaciones";
import Reportes from "./pages/admin/Reportes";
import Reservaciones from "./pages/admin/Reservaciones";
import Restaurante from "./pages/admin/Restaurante";
import Usuarios from "./pages/admin/Usuarios";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Inicio />} />
          <Route path="bar" element={<Bar />} />
          <Route path="habitaciones" element={<Habitaciones />} />
          <Route path="restaurante" element={<Restaurante />} />
          <Route path="reservaciones" element={<Reservaciones />} />
          <Route path="gastos" element={<Gastos />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
