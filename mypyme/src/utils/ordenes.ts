import type { Orden, AreaMenu } from "../types";

export function totalOrden(orden: Orden): number {
  if (!orden.items || orden.items.length === 0) return 0;
  return orden.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

export function totalOrdenPorArea(orden: Orden, area: AreaMenu): number {
  if (!orden.items || orden.items.length === 0) return 0;
  return orden.items
    .filter((item) => item.area === area)
    .reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

export function esDeHoy(fechaISO: string): boolean {
  if (!fechaISO) return false;
  const fecha = new Date(fechaISO);
  const hoy = new Date();
  return (
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear()
  );
}