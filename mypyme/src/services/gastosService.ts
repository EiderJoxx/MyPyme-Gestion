import { api } from "../utils/api";
import type { Gasto } from "../types";

export const gastosService = {
  listar: () => api<Gasto[]>("/Gastos"),
  crear: (g: Omit<Gasto, "id">) =>
    api<Gasto>("/Gastos", { method: "POST", body: JSON.stringify(g) }),
  actualizar: (id: number, g: Gasto) =>
    api<void>(`/Gastos/${id}`, { method: "PUT", body: JSON.stringify(g) }),
  eliminar: (id: number) => api<void>(`/Gastos/${id}`, { method: "DELETE" }),
};