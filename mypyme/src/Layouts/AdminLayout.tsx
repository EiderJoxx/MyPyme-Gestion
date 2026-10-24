import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
