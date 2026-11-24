import { api, qs } from "../utils/api";
import type {
  EstadoReserva,
  Reserva,
  ReservaCreate,
  ReservaPublicaCreate,
  ReservaPublicaRespuesta,
} from "../types";



export interface FiltroReservas {
  habitacionId?: number;
  estado?: EstadoReserva;
  desde?: string; // "2026-11-01"
  hasta?: string;
}

// Todo este controlador es solo Administrador
export const reservasService = {
  listar: (f: FiltroReservas = {}) => api<Reserva[]>(`/Reservas${qs({ ...f })}`),
  obtener: (id: number) => api<Reserva>(`/Reservas/${id}`),
  crear: (r: ReservaCreate) =>
    api<Reserva>("/Reservas", { method: "POST", body: JSON.stringify(r) }),
  actualizar: (id: number, r: ReservaCreate) =>
    api<Reserva>(`/Reservas/${id}`, { method: "PUT", body: JSON.stringify(r) }),
  cambiarEstado: (id: number, estado: EstadoReserva) =>
    api<Reserva>(`/Reservas/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    }),
  eliminar: (id: number) => api<void>(`/Reservas/${id}`, { method: "DELETE" }),
  crearPublica: (r: ReservaPublicaCreate) =>
  api<ReservaPublicaRespuesta>("/Reservas/publica", {
    method: "POST",
    body: JSON.stringify(r),
  }),
};


