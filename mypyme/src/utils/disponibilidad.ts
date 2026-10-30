import type { Insumo, ItemMenu } from "../types";

export function unidadesDisponibles(
  item: ItemMenu,
  insumos: Insumo[],
): number | undefined {
  if (!item.disponible) return 0;
  const vinculados = insumos.filter(
    (i) => i.itemMenuId === item.id && i.consumoPorVenta > 0,
  );
  if (vinculados.length === 0) return undefined;
  return Math.min(
    ...vinculados.map((i) => Math.floor(i.stock / i.consumoPorVenta)),
  );
}
