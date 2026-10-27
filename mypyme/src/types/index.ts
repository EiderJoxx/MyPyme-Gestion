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

export type AreaMenu = "Restaurante" | "Bar";
export type MetodoPago = "Efectivo" | "Tarjeta" | "Transferencia";

export interface ItemMenu {
  id: number;
  nombre: string;
  area: AreaMenu;
  categoria: string;
  precio: number;
  descripcion: string;
  foto: string;
  disponible: boolean;
}

export interface ItemOrden {
  itemId: number;
  nombre: string;
  area: AreaMenu;
  precio: number; // precio del momento del pedido
  cantidad: number;
}

export type EstadoOrden = "Abierta" | "Cerrada" | "Anulada";

export interface Orden {
  id: number;
  mesa: number;
  fecha: string;
  items: ItemOrden[];
  nota: string;
  estado: EstadoOrden;
  metodoPago?: MetodoPago;
}
