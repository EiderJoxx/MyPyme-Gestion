import { Outlet } from "react-router-dom";
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
