import type { AreaMenu, EstadoHabitacion, MetodoPago } from "../types";

export const TIPOS_HABITACION: string[] = [
  "Sencilla",
  "Doble",
  "Familiar",
  "Suite",
];

export const ESTADOS_HABITACION: EstadoHabitacion[] = [
  "Disponible",
  "Ocupada",
  "Limpieza",
  "Mantenimiento",
];

export const AREAS: AreaMenu[] = ["Restaurante", "Bar"];

export const CATEGORIAS_MENU: Record<AreaMenu, string[]> = {
  Restaurante: [
    "Entradas",
    "Platos fuertes",
    "Mariscos",
    "Acompañamientos",
    "Postres",
  ],
  Bar: ["Cervezas", "Cocteles", "Licores", "Sin alcohol", "Otras bebidas"],
};

export const COLOR_AREA: Record<AreaMenu, string> = {
  Restaurante: "text-bg-warning",
  Bar: "text-bg-info",
};

export const METODOS_PAGO: MetodoPago[] = [
  "Efectivo",
  "Tarjeta",
  "Transferencia",
];

export const MESAS: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
