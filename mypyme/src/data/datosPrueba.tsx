import type { Habitacion, Reserva } from "../types";

export const habitaciones: Habitacion[] = [
  {
    id: 1,
    numero: "101",
    tipo: "Individual",
    estado: "Disponible",
    precio: 50,
  },
  { id: 2, numero: "102", tipo: "Doble", estado: "Ocupada", precio: 80 },
  { id: 3, numero: "103", tipo: "Suite", estado: "Mantenimiento", precio: 120 },
];

export const reservas: Reserva[] = [
  {
    id: 1,
    habitacionId: 2,
    cliente: "Juan Pérez",
    fechaEntrada: "2023-10-01",
    fechaSalida: "2023-10-05",
    estado: "Confirmada",
  },
  {
    id: 2,
    habitacionId: 1,
    cliente: "María López",
    fechaEntrada: "2023-10-03",
    fechaSalida: "2023-10-07",
    estado: "Pendiente",
  },
  {
    id: 3,
    habitacionId: 3,
    cliente: "Carlos García",
    fechaEntrada: "2023-10-02",
    fechaSalida: "2023-10-06",
    estado: "Check-in",
  },
];
