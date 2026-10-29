import { menuInicial } from "../data/datosPrueba";
import type { ItemMenu, Orden, Reserva } from "../types";

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? (JSON.parse(guardado) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export const leerMenuGuardado = () =>
  leer<ItemMenu[]>("mypyme_menu", menuInicial);
export const leerOrdenesGuardadas = () => leer<Orden[]>("mypyme_ordenes", []);
export const leerReservasGuardadas = () =>
  leer<Reserva[]>("mypyme_reservas", []);
