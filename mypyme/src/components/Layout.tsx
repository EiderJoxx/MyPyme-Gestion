import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar.tsx";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
}
