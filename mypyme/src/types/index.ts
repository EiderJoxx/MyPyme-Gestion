export type Rol = "Administrador" | "Vendedor";

export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  rol: Rol;
  activo: boolean;
  salt: string;
  hash: string; // contraseña cifrada
  creado: string;
}

export interface DatosFormularioUsuario {
  nombre: string;
  usuario: string;
  rol: Rol;
  activo: boolean;
  clave: string;
}

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
  precio: number;
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
  vendedorId?: number;
  vendedor?: string;
}
export interface Reserva {
  id: number;
  cliente: string;
  documento: string;
  telefono: string;
  habitacionId: number;
  personas: number;
  checkIn: string;
  checkOut: string;
  estado: EstadoReserva;
  precioNoche: number;
  anticipo: number;
  notas: string;
}
export type TipoMovimiento = "Entrada" | "Salida" | "Ajuste";

export interface Insumo {
  id: number;
  nombre: string;
  categoria: string;
  unidad: string;
  stock: number;
  stockMinimo: number;
  costoUnitario: number;
  itemMenuId?: number;
  consumoPorVenta: number;
}

export interface MovimientoInventario {
  id: number;
  insumoId: number;
  nombreInsumo: string;
  tipo: TipoMovimiento;
  cantidad: number;
  fecha: string;
  detalle: string;
}

export interface DatosMovimiento {
  cantidad: number;
  costoTotal: number;
  proveedor: string;
  detalle: string;
}

export interface Gasto {
  id: number;
  fecha: string;
  categoria: string;
  descripcion: string;
  proveedor: string;
  monto: number;
}
