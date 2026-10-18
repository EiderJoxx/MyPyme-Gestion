import { Outlet } from "react-router-dom";

import Header from "./Header.tsx";

import Sidebar from "./Sidebar.tsx";

export default function Layout() {
  return (
    <div className="app">
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="contenido">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
