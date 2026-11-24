import type { AreaMenu, Orden } from "../types";

export const totalOrden = (o: Orden) => o.total;

export const totalOrdenPorArea = (o: Orden, area: AreaMenu) =>
  o.detalles
    .filter((d) => d.area === area)
    .reduce((suma, d) => suma + d.subtotal, 0);

export const esDeHoy = (fecha: string) =>
  new Date(fecha).toLocaleDateString("en-CA") ===
  new Date().toLocaleDateString("en-CA");