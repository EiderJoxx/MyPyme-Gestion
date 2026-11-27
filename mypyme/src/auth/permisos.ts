import type { Rol } from "../types";

export const ROLES: Rol[] = ["SuperAdmin", "Administrador", "Vendedor"];

export const RUTAS_POR_ROL: Record<Rol, string[]> = {
  SuperAdmin: ["/admin/usuarios"],
  Administrador: ["*"],
  Vendedor: ["/admin/ventas"],
};

export const RUTA_INICIAL: Record<Rol, string> = {
  SuperAdmin: "/admin/usuarios",
  Administrador: "/admin",
  Vendedor: "/admin/ventas",
};

export const DESCRIPCION_ROL: Record<Rol, string> = {
  SuperAdmin:
    "Control total. Unico autorizado para crear administradores con llave maestra",
  Administrador:
    "Gestion completa del negocio. No puede crear otros administradores",
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
