// Las fechas se manejan como texto AAAA-MM-DD para evitar errores de zona horaria
export const hoyISO = () => new Date().toLocaleDateString("en-CA");

function partes(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return { a, m, d };
}

export function sumarDias(iso: string, dias: number) {
  const { a, m, d } = partes(iso);
  return new Date(a, m - 1, d + dias).toLocaleDateString("en-CA");
}

export function nochesEntre(entrada: string, salida: string) {
  const e = partes(entrada);
  const s = partes(salida);
  return Math.round(
    (Date.UTC(s.a, s.m - 1, s.d) - Date.UTC(e.a, e.m - 1, e.d)) / 86400000,
  );
}

export function formatoFecha(iso: string) {
  const { a, m, d } = partes(iso);
  return new Date(a, m - 1, d).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

export function etiquetaDia(iso: string) {
  const { a, m, d } = partes(iso);
  const fecha = new Date(a, m - 1, d);
  return {
    semana: fecha.toLocaleDateString("es-CO", { weekday: "short" }),
    dia: String(d),
  };
}
