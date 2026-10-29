import type { Gasto, Orden, Reserva } from "../types";
import { hoyISO, sumarDias } from "./fechas";

export type Periodo = "hoy" | "7dias" | "mes" | "mesAnterior" | "todo";

export const PERIODOS: { valor: Periodo; etiqueta: string }[] = [
  { valor: "hoy", etiqueta: "Hoy" },
  { valor: "7dias", etiqueta: "Últimos 7 días" },
  { valor: "mes", etiqueta: "Este mes" },
  { valor: "mesAnterior", etiqueta: "Mes anterior" },
  { valor: "todo", etiqueta: "Todo" },
];

const iso = (f: Date) => f.toLocaleDateString("en-CA");
export const diaLocal = (fechaISO: string) => iso(new Date(fechaISO));

export function rangoDe(periodo: Periodo) {
  const hoy = hoyISO();
  const [a, m] = hoy.split("-").map(Number);
  switch (periodo) {
    case "hoy":
      return { desde: hoy, hasta: hoy };
    case "7dias":
      return { desde: sumarDias(hoy, -6), hasta: hoy };
    case "mes":
      return {
        desde: iso(new Date(a, m - 1, 1)),
        hasta: iso(new Date(a, m, 0)),
      };
    case "mesAnterior":
      return {
        desde: iso(new Date(a, m - 2, 1)),
        hasta: iso(new Date(a, m - 1, 0)),
      };
    default:
      return { desde: "0000-01-01", hasta: "9999-12-31" };
  }
}

export interface Movimiento {
  fecha: string;
  tipo: "Ingreso" | "Gasto";
  concepto: string;
  monto: number;
}

export function calcularResumen(
  ordenes: Orden[],
  reservas: Reserva[],
  gastos: Gasto[],
  desde: string,
  hasta: string,
) {
  const enRango = (f: string) => f >= desde && f <= hasta;
  const movimientos: Movimiento[] = [];

  // Restaurante y bar: órdenes cobradas
  let ventasRestaurante = 0;
  let ventasBar = 0;
  const productos = new Map<
    string,
    { nombre: string; cantidad: number; total: number }
  >();
  const metodos: Record<string, number> = {};

  ordenes
    .filter((o) => o.estado === "Cerrada" && enRango(diaLocal(o.fecha)))
    .forEach((o) => {
      let totalOrden = 0;
      o.items.forEach((i) => {
        const subtotal = i.precio * i.cantidad;
        totalOrden += subtotal;
        if ((i.area ?? "Restaurante") === "Bar") ventasBar += subtotal;
        else ventasRestaurante += subtotal;

        const p = productos.get(i.nombre) ?? {
          nombre: i.nombre,
          cantidad: 0,
          total: 0,
        };
        p.cantidad += i.cantidad;
        p.total += subtotal;
        productos.set(i.nombre, p);
      });
      const metodo = o.metodoPago ?? "Sin dato";
      metodos[metodo] = (metodos[metodo] ?? 0) + totalOrden;
      movimientos.push({
        fecha: diaLocal(o.fecha),
        tipo: "Ingreso",
        concepto: `Venta mesa ${o.mesa}`,
        monto: totalOrden,
      });
    });

  // Hospedaje: lo cobrado (anticipos y abonos) de reservas no canceladas, a la fecha de entrada
  const reservasCobradas = reservas.filter(
    (r) => r.estado !== "Cancelada" && r.anticipo > 0 && enRango(r.checkIn),
  );
  const hospedaje = reservasCobradas.reduce((suma, r) => suma + r.anticipo, 0);
  reservasCobradas.forEach((r) =>
    movimientos.push({
      fecha: r.checkIn,
      tipo: "Ingreso",
      concepto: `Hospedaje · ${r.cliente}`,
      monto: r.anticipo,
    }),
  );

  // Gastos
  const gastosRango = gastos.filter((g) => enRango(g.fecha));
  const totalGastos = gastosRango.reduce((suma, g) => suma + g.monto, 0);
  const porCategoria = new Map<string, number>();
  gastosRango.forEach((g) => {
    porCategoria.set(
      g.categoria,
      (porCategoria.get(g.categoria) ?? 0) + g.monto,
    );
    movimientos.push({
      fecha: g.fecha,
      tipo: "Gasto",
      concepto: `${g.categoria} · ${g.descripcion}`,
      monto: g.monto,
    });
  });

  const ingresos = ventasRestaurante + ventasBar + hospedaje;

  return {
    ventasRestaurante,
    ventasBar,
    hospedaje,
    ingresos,
    gastos: totalGastos,
    utilidad: ingresos - totalGastos,
    gastosPorCategoria: Array.from(porCategoria, ([categoria, monto]) => ({
      categoria,
      monto,
    })).sort((a, b) => b.monto - a.monto),
    topProductos: Array.from(productos.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5),
    pagosPorMetodo: Object.entries(metodos),
    movimientos: movimientos.sort((a, b) => a.fecha.localeCompare(b.fecha)),
  };
}
