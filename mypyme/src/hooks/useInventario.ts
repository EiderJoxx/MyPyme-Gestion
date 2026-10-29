import { useLocalStorage } from "./useLocalStorage";
import { insumosIniciales } from "../data/datosPrueba";
import type {
  Insumo,
  ItemOrden,
  MovimientoInventario,
  TipoMovimiento,
} from "../types";

export function useInventario() {
  const [insumos, setInsumos] = useLocalStorage<Insumo[]>(
    "mypyme_insumos",
    insumosIniciales,
  );
  const [movimientos, setMovimientos] = useLocalStorage<MovimientoInventario[]>(
    "mypyme_movimientos",
    [],
  );

  function guardarInsumo(datos: Omit<Insumo, "id">, id?: number) {
    if (id) {
      setInsumos((prev) =>
        prev.map((i) => (i.id === id ? { ...datos, id } : i)),
      );
      return;
    }
    const nuevoId = Date.now();
    setInsumos((prev) => [...prev, { ...datos, id: nuevoId }]);
    if (datos.stock > 0) {
      setMovimientos((prev) => [
        ...prev,
        {
          id: nuevoId + 1,
          insumoId: nuevoId,
          nombreInsumo: datos.nombre,
          tipo: "Entrada",
          cantidad: datos.stock,
          fecha: new Date().toISOString(),
          detalle: "Stock inicial",
        },
      ]);
    }
  }

  function eliminarInsumo(id: number) {
    setInsumos((prev) => prev.filter((i) => i.id !== id));
  }

  // valor: cantidad (Entrada/Salida) o el stock contado (Ajuste)
  function registrarMovimiento(
    id: number,
    tipo: TipoMovimiento,
    valor: number,
    detalle: string,
    costoUnitario?: number,
  ) {
    const actual = insumos.find((i) => i.id === id);
    if (!actual) return;
    const delta =
      tipo === "Entrada"
        ? valor
        : tipo === "Salida"
          ? -valor
          : valor - actual.stock;
    const stockNuevo = Math.max(0, actual.stock + delta);

    setInsumos((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              stock: stockNuevo,
              costoUnitario: costoUnitario ?? i.costoUnitario,
            }
          : i,
      ),
    );
    setMovimientos((prev) => [
      ...prev,
      {
        id: Date.now(),
        insumoId: id,
        nombreInsumo: actual.nombre,
        tipo,
        cantidad: delta,
        fecha: new Date().toISOString(),
        detalle,
      },
    ]);
  }

  // Descuenta los insumos vinculados a los productos de una orden cobrada
  function descontarVenta(items: ItemOrden[], referencia: string) {
    const descuentos = new Map<number, number>();
    insumos.forEach((ins) => {
      if (ins.itemMenuId === undefined) return;
      const vendidos = items
        .filter((i) => i.itemId === ins.itemMenuId)
        .reduce((s, i) => s + i.cantidad, 0);
      if (vendidos > 0) descuentos.set(ins.id, vendidos * ins.consumoPorVenta);
    });
    if (descuentos.size === 0) return;

    setInsumos((prev) =>
      prev.map((i) =>
        descuentos.has(i.id)
          ? { ...i, stock: Math.max(0, i.stock - (descuentos.get(i.id) ?? 0)) }
          : i,
      ),
    );
    setMovimientos((prev) => [
      ...prev,
      ...Array.from(descuentos, ([insumoId, cantidad], pos) => ({
        id: Date.now() + pos,
        insumoId,
        nombreInsumo: insumos.find((i) => i.id === insumoId)?.nombre ?? "",
        tipo: "Salida" as const,
        cantidad: -cantidad,
        fecha: new Date().toISOString(),
        detalle: referencia,
      })),
    ]);
  }

  return {
    insumos,
    movimientos,
    guardarInsumo,
    eliminarInsumo,
    registrarMovimiento,
    descontarVenta,
  };
}
