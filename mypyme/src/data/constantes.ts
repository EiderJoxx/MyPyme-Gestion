import type { EstadoHabitacion } from "../types";

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

export const CATEGORIAS_PLATO: string[] = [
  "Entradas",
  "Platos fuertes",
  "Mariscos",
  "Acompañamientos",
  "Postres",
];

export const MESAS: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
