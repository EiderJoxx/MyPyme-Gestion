import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { insumosService } from "../services/insumosService";
import { movimientosService } from "../services/movimientosService";
import { intentar, mensajeError } from "../utils/api";
import type {
  Insumo,
  InsumoCreate,
  MovimientoInventario,
  TipoMovimiento,
} from "../types";

const normalizarInsumo = (i: Insumo): Insumo => ({
  ...i,
  categoria: i.categoria ?? "",
  unidad: i.unidad ?? "",
  itemMenuId: i.itemMenuId ?? undefined,
});

const normalizarMovimiento = (m: MovimientoInventario): MovimientoInventario => ({
  ...m,
  insumoNombre: m.insumoNombre ?? "",
  detalle: m.detalle ?? "",
});

const aCuerpo = (d: InsumoCreate): InsumoCreate => ({
  nombre: d.nombre.trim(),
  categoria: d.categoria?.trim() || null,
  unidad: d.unidad?.trim() || null,
  stock: d.stock,
  stockMinimo: d.stockMinimo,
  costoUnitario: d.costoUnitario,
  itemMenuId: d.itemMenuId ?? null,
  consumoPorVenta: d.consumoPorVenta,
});

export function useInventario() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === "Administrador";

  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    try {
      setError(null);
      const [ins, mov] = await Promise.all([
        insumosService.listar(),
        // Los movimientos son solo del Administrador
        esAdmin
          ? movimientosService.listar()
          : Promise.resolve([] as MovimientoInventario[]),
      ]);
      setInsumos(ins.map(normalizarInsumo));
      setMovimientos(mov.map(normalizarMovimiento));
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, [esAdmin]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  // Todas devuelven null si salió bien, o el mensaje de error del servidor
  function guardarInsumo(datos: InsumoCreate, id?: number) {
    return intentar(async () => {
      try {
        const cuerpo = aCuerpo(datos);
        if (id) {
          const actual = insumos.find((i) => i.id === id);
          await insumosService.actualizar(id, cuerpo);
          // El PUT ignora el stock: si cambió, se aplica como ajuste
          if (actual && datos.stock !== actual.stock) {
            await movimientosService.registrar({
              insumoId: id,
              tipo: "Ajuste",
              cantidad: datos.stock,
              detalle: "Ajuste al editar el insumo",
            });
          }
        } else {
          await insumosService.crear(cuerpo);
        }
      } finally {
        await recargar();
      }
    });
  }

  function eliminarInsumo(id: number) {
    return intentar(async () => {
      try {
        await insumosService.eliminar(id);
      } finally {
        await recargar();
      }
    });
  }

  // valor: cantidad (Entrada/Salida) o el stock contado (Ajuste)
  function registrarMovimiento(
    id: number,
    tipo: TipoMovimiento,
    valor: number,
    detalle: string,
    costoUnitario?: number,
  ) {
    return intentar(async () => {
      const actual = insumos.find((i) => i.id === id);
      if (!actual) throw new Error("El insumo ya no existe");
      try {
        await movimientosService.registrar({
          insumoId: id,
          tipo,
          cantidad: valor,
          detalle: detalle.trim() || null,
        });
        // La API no guarda el costo en el movimiento: se actualiza en el insumo
        if (
          costoUnitario !== undefined &&
          costoUnitario > 0 &&
          costoUnitario !== actual.costoUnitario
        ) {
          await insumosService.actualizar(
            id,
            aCuerpo({ ...actual, costoUnitario }),
          );
        }
      } finally {
        await recargar();
      }
    });
  }

  return {
    insumos,
    movimientos,
    cargando,
    error,
    recargar,
    guardarInsumo,
    eliminarInsumo,
    registrarMovimiento,
  };
}