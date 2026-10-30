import type { Rol } from "../types";

export const ROLES: Rol[] = ["Administrador", "Vendedor"];

export const RUTAS_POR_ROL: Record<Rol, string[]> = {
  Administrador: ["*"],
  Vendedor: ["/admin/ventas"],
};

export const RUTA_INICIAL: Record<Rol, string> = {
  Administrador: "/admin",
  Vendedor: "/admin/ventas",
};

export const DESCRIPCION_ROL: Record<Rol, string> = {
  Administrador:
    "Acceso total: hospedaje, restaurante y bar, administración, usuarios y punto de venta.",
  Vendedor:
    "Solo punto de venta: ingresa órdenes, consulta la disponibilidad y cobra sus ventas.",
};

export function puedeVer(rol: Rol, ruta: string) {
  const permitidas = RUTAS_POR_ROL[rol];
  return (
    permitidas.includes("*") ||
    permitidas.some((p) => ruta === p || ruta.startsWith(p + "/"))
  );
}
