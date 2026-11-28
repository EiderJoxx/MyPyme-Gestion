export type Rol = "SuperAdmin" | "Administrador" | "Vendedor";
export type EstadoHabitacion = "Disponible" | "Ocupada" | "Limpieza" | "Mantenimiento";
export type EstadoReserva = "Pendiente" | "Confirmada" | "CheckIn" | "CheckOut" | "Cancelada";
export type AreaMenu = "Restaurante" | "Bar";
export type MetodoPago = "Efectivo" | "Tarjeta" | "Transferencia";
export type EstadoOrden = "Abierta" | "Cerrada" | "Anulada";
export type TipoMovimiento = "Entrada" | "Salida" | "Ajuste";

export interface LoginRequest {
  nombreUsuario: string;
  clave: string;
}

export interface DatosFormularioUsuario {
  nombre: string;
  nombreUsuario: string;
  rol: Rol;
  activo: boolean;
  clave: string;
  llaveSeguridad?: string;
}

export interface LoginRespuesta {
  token: string;
  expira: string;
  id: number;
  nombre: string;
  rol: Rol;
}

export interface RegistroRequest {
  nombre: string;
  nombreUsuario: string;
  clave: string;
  rol?: Rol;
}

export interface Usuario {
  id: number;
  nombre: string;
  nombreUsuario: string;
  rol: Rol;
  activo: boolean;
  salt: string;
  hash: string;
  creado: string;
}

export interface UsuarioCreate {
  nombre: string;
  nombreUsuario: string;
  clave: string;
  rol: Rol;
  activo: boolean;
}

export interface UsuarioUpdate {
  nombre: string;
  rol: Rol;
  activo: boolean;
  nuevaClave?: string | null;
}

export interface Habitacion {
  id: number;
  numero: string;
  tipo: string;
  capacidad: number;
  precioNoche: number;
  estado: EstadoHabitacion;
  imagen?: string | null;
  descripcion?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  reservas?: Reserva[];
}

export type HabitacionCreate = Omit<Habitacion, "id" | "reservas">;

export interface RangoOcupado {
  checkIn: string;
  checkOut: string;
}

export interface ItemMenuCreate {
  nombre: string;
  area: AreaMenu;
  categoria: string;
  precio: number;
  descripcion?: string | null;
  foto?: string | null;
  disponible: boolean;
}

export interface ItemMenu {
  id: number;
  nombre: string;
  area: AreaMenu;
  categoria: string;
  precio: number;
  descripcion?: string | null;
  foto?: string | null;
  disponible: boolean;
}

export type Bebida = Pick<ItemMenu, "id" | "nombre" | "precio" | "descripcion" | "foto">;

export interface DetalleOrden {
  id: number;
  ordenId: number;
  itemMenuId: number;
  itemMenuNombre?: string | null;
  cantidad: number;
  precioUnitario: number;
  area: AreaMenu;
  subtotal: number;
}

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

export interface DetalleOrdenCreate {
  itemMenuId: number;
  cantidad: number;
  precioUnitario: number;
  area: AreaMenu;
}

export interface OrdenCreate {
  mesa: number;
  nota: string;
  vendedorId?: number;
  detalles: {
    itemMenuId: number;
    cantidad: number;
    precioUnitario: number;
    area: AreaMenu;
  }[];
}

export interface OrdenUpdate {
  mesa: number;
  nota?: string | null;
}

export interface OrdenCobro {
  metodoPago: MetodoPago;
}

export interface ItemOrden {
  itemId: number;
  nombre: string;
  area: AreaMenu;
  precio: number;
  cantidad: number;
}

export interface Reserva {
  id: number;
  cliente: string;
  documento: string;
  telefono: string;
  habitacionId: number;
  habitacionNumero?: string | null;
  personas: number;
  checkIn: string;
  checkOut: string;
  estado: EstadoReserva;
  precioNoche: number;
  anticipo: number;
  notas?: string | null;
  noches: number;
  total: number;
  saldo: number;
}

export type ReservaCreate = Omit<
  Reserva,
  "id" | "habitacionNumero" | "noches" | "total" | "saldo"
>;

export interface ReservaPublicaCreate {
  cliente: string;
  documento: string;
  telefono: string;
  habitacionId: number;
  personas: number;
  checkIn: string;
  checkOut: string;
  sitio?: string;
}

export interface ReservaPublicaRespuesta {
  id: number;
  habitacionNumero: string;
  checkIn: string;
  checkOut: string;
  noches: number;
  total: number;
}

export interface Insumo {
  id: number;
  nombre: string;
  categoria?: string | null;
  unidad?: string | null;
  stock: number;
  stockMinimo: number;
  costoUnitario: number;
  itemMenuId?: number | null;
  itemMenuNombre?: string | null;
  consumoPorVenta: number;
  stockBajo: boolean;
}

export type InsumoCreate = Omit<Insumo, "id" | "itemMenuNombre" | "stockBajo">;

export interface MovimientoInventario {
  id: number;
  insumoId: number;
  insumoNombre?: string | null;
  tipo: TipoMovimiento;
  cantidad: number;
  fecha: string;
  detalle?: string | null;
}

export interface MovimientoInventarioCreate {
  insumoId: number;
  tipo: TipoMovimiento;
  cantidad: number;
  detalle?: string | null;
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
  descripcion?: string | null;
  proveedor?: string | null;
  monto: number;
}

export interface GastoCreate {
  fecha?: string | null;
  categoria: string;
  descripcion?: string | null;
  proveedor?: string | null;
  monto: number;
}