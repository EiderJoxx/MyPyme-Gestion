import { api } from "../utils/api";
import type { Gasto, GastoCreate } from "../types";

export const gastosService = {
  listar: () => api<Gasto[]>("/Gastos"),
  
  crear: (g: GastoCreate) =>
    api<Gasto>("/Gastos", { method: "POST", body: JSON.stringify(g) }),
    
  actualizar: (id: number, g: GastoCreate) =>
    api<void>(`/Gastos/${id}`, { method: "PUT", body: JSON.stringify(g) }),
    
  eliminar: (id: number) => api<void>(`/Gastos/${id}`, { method: "DELETE" }),
};