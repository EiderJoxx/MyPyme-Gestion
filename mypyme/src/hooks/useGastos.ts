import { useCallback, useEffect, useState } from "react";
import { gastosService } from "../services/gastosService";
import { intentar, mensajeError } from "../utils/api";
import type { Gasto, GastoCreate } from "../types";

const normalizar = (g: Gasto): Gasto => ({
  ...g,
  fecha: g.fecha.slice(0, 10),
  descripcion: g.descripcion ?? "",
  proveedor: g.proveedor ?? "",
});

export function useGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    try {
      setError(null);
      const lista = await gastosService.listar();
      setGastos(lista.map(normalizar));
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  // Devuelve null si salió bien, o el mensaje de error
  function guardar(datos: Omit<Gasto, "id">, id?: number) {
    return intentar(async () => {
      const cuerpo: GastoCreate = {
        fecha: datos.fecha || null, // sin fecha, el servidor usa la actual
        categoria: datos.categoria,
        descripcion: datos.descripcion?.trim() || null,
        proveedor: datos.proveedor?.trim() || null,
        monto: datos.monto,
      };
      if (id) await gastosService.actualizar(id, cuerpo);
      else await gastosService.crear(cuerpo);
      await recargar();
    });
  }

  function eliminar(id: number) {
    return intentar(async () => {
      await gastosService.eliminar(id);
      await recargar();
    });
  }

  return { gastos, cargando, error, recargar, guardar, eliminar };
}