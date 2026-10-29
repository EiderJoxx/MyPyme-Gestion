import type { EstadoReserva, Reserva } from "../types";
import { nochesEntre } from "./fechas";

const ESTADOS_QUE_OCUPAN: EstadoReserva[] = [
  "Pendiente",
  "Confirmada",
  "CheckIn",
];

export const ocupa = (r: Reserva) => ESTADOS_QUE_OCUPAN.includes(r.estado);

export function estaLibre(
  habitacionId: number,
  reservas: Reserva[],
  entrada: string,
  salida: string,
) {
  return !reservas.some(
    (r) =>
      r.habitacionId === habitacionId &&
      ocupa(r) &&
      r.checkIn < salida &&
      entrada < r.checkOut,
  );
}

export const noches = (r: Reserva) => nochesEntre(r.checkIn, r.checkOut);
export const totalHospedaje = (r: Reserva) => noches(r) * r.precioNoche;

export function ocupacionDe(
  habitacionId: number,
  reservas: Reserva[],
  hoy: string,
) {
  const delaHabitacion = reservas.filter(
    (r) => r.habitacionId === habitacionId,
  );

  const enCasa = delaHabitacion.find((r) => r.estado === "CheckIn");
  if (enCasa) return { tipo: "enCasa" as const, reserva: enCasa };

  const proxima = delaHabitacion
    .filter(
      (r) =>
        (r.estado === "Pendiente" || r.estado === "Confirmada") &&
        r.checkOut > hoy,
    )
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0];

  return proxima ? { tipo: "proxima" as const, reserva: proxima } : null;
}
