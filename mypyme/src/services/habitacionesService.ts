import { api, qs } from "../utils/api";
import type {
  EstadoHabitacion,
  Habitacion,
  HabitacionCreate,
  RangoOcupado,
} from "../types";

export const habitacionesService = {
  // Requiere sesión
  listar: (estado?: EstadoHabitacion) =>
    api<Habitacion[]>(`/Habitaciones${qs({ estado })}`),
  obtener: (id: number) => api<Habitacion>(`/Habitaciones/${id}`),

  // Solo Administrador
  crear: (h: HabitacionCreate) =>
    api<Habitacion>("/Habitaciones", { method: "POST", body: JSON.stringify(h) }),
  actualizar: (id: number, h: HabitacionCreate) =>
    api<Habitacion>(`/Habitaciones/${id}`, { method: "PUT", body: JSON.stringify(h) }),
  cambiarEstado: (id: number, estado: EstadoHabitacion) =>
    api<Habitacion>(`/Habitaciones/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    }),
  eliminar: (id: number) => api<void>(`/Habitaciones/${id}`, { method: "DELETE" }),

  // Públicos (sin sesión): para el landing
  disponibles: (entrada: string, salida: string) =>
    api<Habitacion[]>(`/Habitaciones/disponibles${qs({ entrada, salida })}`),
  ocupacion: (id: number) => api<RangoOcupado[]>(`/Habitaciones/${id}/ocupacion`),
};