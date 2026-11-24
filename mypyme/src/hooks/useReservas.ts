import { useCallback, useEffect, useState } from "react";
import { reservasService } from "../services/reservasService";
import { intentar, mensajeError } from "../utils/api";
import type { EstadoReserva, Reserva, ReservaCreate } from "../types";

// Fechas como "YYYY-MM-DD" para los <input type="date"> y los utils de fechas
const normalizar = (r: Reserva): Reserva => ({
  ...r,
  checkIn: r.checkIn.slice(0, 10),
  checkOut: r.checkOut.slice(0, 10),
  notas: r.notas ?? "",
});

// Solo se envían los campos que la API acepta (sin noches, total ni saldo)
const aCuerpo = (r: Reserva | ReservaCreate): ReservaCreate => ({
  cliente: r.cliente,
  documento: r.documento,
  telefono: r.telefono,
  habitacionId: r.habitacionId,
  personas: r.personas,
  checkIn: r.checkIn,
  checkOut: r.checkOut,
  estado: r.estado,
  precioNoche: r.precioNoche,
  anticipo: r.anticipo,
  notas: r.notas ?? null,
});

export function useReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    try {
      setError(null);
      const lista = await reservasService.listar();
      setReservas(lista.map(normalizar));
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  // Todas devuelven null si salió bien, o el mensaje de error del servidor
  function crear(datos: ReservaCreate) {
    return intentar(async () => {
      await reservasService.crear(aCuerpo(datos));
      await recargar();
    });
  }

  function actualizar(id: number, datos: ReservaCreate) {
    return intentar(async () => {
      await reservasService.actualizar(id, aCuerpo(datos));
      await recargar();
    });
  }

  // El servidor también cambia la habitación: CheckIn la pone Ocupada y
  // CheckOut la pone en Limpieza. Recarga las habitaciones después de llamarla.
  function cambiarEstado(id: number, estado: EstadoReserva) {
    return intentar(async () => {
      await reservasService.cambiarEstado(id, estado);
      await recargar();
    });
  }

  function abonar(id: number, monto: number) {
    return intentar(async () => {
      if (!(monto > 0)) throw new Error("El abono debe ser mayor que cero");
      const actual = await reservasService.obtener(id);
      await reservasService.actualizar(
        id,
        aCuerpo({ ...actual, anticipo: actual.anticipo + monto }),
      );
      await recargar();
    });
  }

  function eliminar(id: number) {
    return intentar(async () => {
      await reservasService.eliminar(id);
      await recargar();
    });
  }

  return {
    reservas,
    cargando,
    error,
    recargar,
    crear,
    actualizar,
    cambiarEstado,
    abonar,
    eliminar,
  };
}