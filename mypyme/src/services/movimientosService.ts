import { api, qs } from "../utils/api";
import type {
  MovimientoInventario,
  MovimientoInventarioCreate,
  TipoMovimiento,
} from "../types";

export interface FiltroMovimientos {
  insumoId?: number;
  tipo?: TipoMovimiento;
  desde?: string; // "2026-11-01"
  hasta?: string;
}

export const movimientosService = {
  listar: (f: FiltroMovimientos = {}) =>
    api<MovimientoInventario[]>(`/MovimientosInventario${qs({ ...f })}`),
  // Entrada suma, Salida resta, Ajuste = nuevo stock. No hay editar ni borrar.
  registrar: (m: MovimientoInventarioCreate) =>
    api<MovimientoInventario>("/MovimientosInventario", {
      method: "POST",
      body: JSON.stringify(m),
    }),
};