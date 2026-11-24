import { useCallback, useEffect, useState } from "react";
import { menuService, ordenService } from "../services/restauranteService";
import { intentar, mensajeError } from "../utils/api";
import type {
  ItemMenu,
  ItemMenuCreate,
  Orden,
  OrdenCreate,
  MetodoPago,
  ItemOrden,
} from "../types";

// Convierte el JSON del backend (detalles) al formato del frontend (items)
const normalizarOrden = (o: any): Orden => ({
  id: o.id,
  mesa: o.mesa,
  fecha: o.fecha,
  nota: o.nota ?? "",
  estado: o.estado,
  metodoPago: o.metodoPago,
  vendedorId: o.vendedorId,
  vendedor: o.vendedorNombre,
  // Forzamos el tipado de retorno a ItemOrden para que TypeScript esté feliz
  items: (o.detalles || []).map((d: any): ItemOrden => ({
    itemId: d.itemMenuId,
    nombre: d.itemMenuNombre || "Sin nombre", // Previene que sea undefined
    area: d.area,
    precio: d.precioUnitario || 0,
    cantidad: d.cantidad || 1,
  })),
});

export function useRestauranteBar() {
  const [menu, setMenu] = useState<ItemMenu[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    try {
      setError(null);
      const [m, o] = await Promise.all([
        menuService.listar(),
        ordenService.listar(),
      ]);
      setMenu(m);
      setOrdenes(o.map(normalizarOrden));
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  function guardarItem(datos: ItemMenuCreate, id?: number) {
    return intentar(async () => {
      if (id) await menuService.actualizar(id, datos);
      else await menuService.crear(datos);
      await recargar();
    });
  }

  function eliminarItem(id: number) {
    return intentar(async () => {
      await menuService.eliminar(id);
      await recargar();
    });
  }

  function cambiarDisponible(id: number) {
    return intentar(async () => {
      const item = menu.find((m) => m.id === id);
      if (!item) throw new Error("Ítem no encontrado");
      await menuService.actualizar(id, { ...item, disponible: !item.disponible });
      await recargar();
    });
  }

  function guardarOrden(
    mesa: number,
    items: ItemOrden[], // CORREGIDO: Ya no es any[], ahora es ItemOrden[]
    nota: string,
    vendedor?: { id: number; nombre: string }
  ) {
    return intentar(async () => {
      const body: OrdenCreate = {
        mesa,
        nota: nota.trim(),
        vendedorId: vendedor?.id,
        detalles: items.map((i) => ({
          itemMenuId: i.itemId,
          cantidad: i.cantidad,
          precioUnitario: i.precio,
          area: i.area,
        })),
      };
      await ordenService.crear(body);
      await recargar();
    });
  }

  function cobrar(id: number, metodoPago: MetodoPago) {
    return intentar(async () => {
      await ordenService.cobrar(id, metodoPago);
      await recargar();
    });
  }

  function anular(id: number) {
    return intentar(async () => {
      await ordenService.anular(id);
      await recargar();
    });
  }

  return {
    menu,
    ordenes,
    cargando,
    error,
    recargar,
    guardarItem,
    eliminarItem,
    cambiarDisponible,
    guardarOrden,
    cobrar,
    anular,
  };
}