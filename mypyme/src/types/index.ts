export type EstadoHabitacion =
  | "Disponible"
  | "Ocupada"
  | "Limpieza"
  | "Mantenimiento";

export type EstadoReserva =
  | "Pendiente"
  | "Confirmada"
  | "CheckIn"
  | "CheckOut"
  | "Cancelada";

export interface Habitacion {
  id: number;
  numero: string;
  tipo: string;
  capacidad: number;
  precioNoche: number;
  estado: EstadoHabitacion;
}

export interface Reserva {
  id: number;
  cliente: string;
  habitacionId: number;
  checkIn: string;
  checkOut: string;
  estado: EstadoReserva;
  anticipo: number;
}

export interface Bebida {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  foto: string;
}

export interface Plato {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  foto: string;
}

export interface ItemOrden {
  platoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export type EstadoOrden = "Abierta" | "Cerrada" | "Anulada";

export interface Orden {
  id: number;
  mesa: number;
  fecha: string;
  items: ItemOrden[];
  estado: EstadoOrden;
}
