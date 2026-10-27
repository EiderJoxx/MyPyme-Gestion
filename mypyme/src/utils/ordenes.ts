import type { AreaMenu, Orden } from "../types";

export const totalOrden = (o: Orden) =>
  o.items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

export const totalOrdenPorArea = (o: Orden, area: AreaMenu) =>
  o.items
    .filter((i) => i.area === area)
    .reduce((suma, i) => suma + i.precio * i.cantidad, 0);

export const esDeHoy = (fecha: string) =>
  new Date(fecha).toLocaleDateString("en-CA") ===
  new Date().toLocaleDateString("en-CA");
