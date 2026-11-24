import { api } from "../utils/api";
import type { ItemMenu, ItemMenuCreate, Orden, OrdenCreate, MetodoPago } from "../types";

export const menuService = {
  listar: () => api<ItemMenu[]>("/ItemsMenu"),
  crear: (m: ItemMenuCreate) =>
    api<ItemMenu>("/ItemsMenu", { method: "POST", body: JSON.stringify(m) }),
  actualizar: (id: number, m: ItemMenuCreate) =>
    api<void>(`/ItemsMenu/${id}`, { method: "PUT", body: JSON.stringify(m) }),
  eliminar: (id: number) => api<void>(`/ItemsMenu/${id}`, { method: "DELETE" }),
};

export const ordenService = {
  listar: () => api<Orden[]>("/Ordenes"),
  crear: (o: OrdenCreate) =>
    api<Orden>("/Ordenes", { method: "POST", body: JSON.stringify(o) }),
    
  cobrar: (id: number, metodoPago: MetodoPago) =>
    api<void>(`/Ordenes/${id}/cobrar`, {
      method: "POST",
      body: JSON.stringify({ metodoPago }),
    }),
    
  anular: (id: number) => api<void>(`/Ordenes/${id}/anular`, { method: "POST" }),
};