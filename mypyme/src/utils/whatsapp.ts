export const WHATSAPP_NUMERO: string =
  import.meta.env.VITE_WHATSAPP_NUMERO ?? "573150619207";

export type RangoOcupado = { entrada: string; salida: string };

export const hayCruce = (
  rangos: RangoOcupado[],
  entrada: string,
  salida: string,
) => rangos.find((r) => entrada < r.salida && salida > r.entrada);

export const nochesEntre = (entrada: string, salida: string) =>
  Math.round(
    (new Date(salida).getTime() - new Date(entrada).getTime()) / 86_400_000,
  );

export const formatoFecha = (s: string) =>
  new Date(s + "T00:00:00").toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });

export const formatoCOP = (n: number) =>
  n.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

export interface DatosReserva {
  negocio: string;
  habitacion: string;
  entrada: string;
  salida: string;
  noches: number;
  personas: number;
  total: number;
  nombre: string;
}

export const mensajeReserva = (d: DatosReserva) =>
  [
    `Hola, quisiera reservar en ${d.negocio}.`,
    "",
    `• Habitación: ${d.habitacion}`,
    `• Llegada: ${formatoFecha(d.entrada)}`,
    `• Salida: ${formatoFecha(d.salida)}`,
    `• Noches: ${d.noches}`,
    `• Personas: ${d.personas}`,
    `• Total estimado: ${formatoCOP(d.total)}`,
    `• Nombre: ${d.nombre}`,
    "",
    "¿Me confirman la disponibilidad? Gracias.",
  ].join("\n");

export const enlaceWhatsApp = (texto: string) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
