export type EstadoHabitacion = "Disponible" | "Ocupada" | "Mantenimiento";
export type EstadoReserva =
  | "Pendiente"
  | "Confirmada"
  | "Check-in"
  | "Check-out"
  | "Cancelada";

export interface Habitacion {
  id: number;
  numero: string;
  tipo: string;
  estado: EstadoHabitacion;
  precio: number;
}

export interface Reserva {
  id: number;
  habitacionId: number;
  cliente: string;
  fechaEntrada: string;
  fechaSalida: string;
  estado: EstadoReserva;
}
