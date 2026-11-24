import { api, qs } from "../utils/api";
import type { Insumo, InsumoCreate } from "../types";

export const insumosService = {
  // Cualquier usuario con sesión
  listar: (f: { categoria?: string; soloStockBajo?: boolean } = {}) =>
    api<Insumo[]>(
      `/Insumos${qs({
        categoria: f.categoria,
        soloStockBajo: f.soloStockBajo ? "true" : undefined,
      })}`,
    ),
  obtener: (id: number) => api<Insumo>(`/Insumos/${id}`),

  // Solo Administrador. El PUT NO modifica el stock (se cambia con movimientos)
  crear: (i: InsumoCreate) =>
    api<Insumo>("/Insumos", { method: "POST", body: JSON.stringify(i) }),
  actualizar: (id: number, i: InsumoCreate) =>
    api<Insumo>(`/Insumos/${id}`, { method: "PUT", body: JSON.stringify(i) }),
  eliminar: (id: number) => api<void>(`/Insumos/${id}`, { method: "DELETE" }),
};