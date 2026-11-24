import { useCallback, useEffect, useState } from "react";
import { habitacionesService } from "../services/habitacionesService";
import { intentar, mensajeError } from "../utils/api";
import type { EstadoHabitacion, Habitacion, HabitacionCreate } from "../types";

const normalizar = (h: Habitacion): Habitacion => ({
  ...h,
  imagen: h.imagen ?? "",
  descripcion: h.descripcion ?? "",
  checkIn: h.checkIn ?? "",
  checkOut: h.checkOut ?? "",
});

// Solo se envían los campos que la API acepta (sin id ni reservas)
const aCuerpo = (h: HabitacionCreate): HabitacionCreate => ({
  numero: h.numero.trim(),
  tipo: h.tipo.trim(),
  capacidad: h.capacidad,
  precioNoche: h.precioNoche,
  estado: h.estado,
  imagen: h.imagen?.trim() || null,
  descripcion: h.descripcion?.trim() || null,
  checkIn: h.checkIn?.trim() || null,
  checkOut: h.checkOut?.trim() || null,
});

export function useHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    try {
      setError(null);
      const lista = await habitacionesService.listar();
      setHabitaciones(lista.map(normalizar));
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  // Crear, editar, cambiar estado y eliminar son solo Administrador.
  // Todas devuelven null si salió bien, o el mensaje de error.
  function agregar(nueva: HabitacionCreate) {
    return intentar(async () => {
      await habitacionesService.crear(aCuerpo(nueva));
      await recargar();
    });
  }

  function actualizar(id: number, datos: HabitacionCreate) {
    return intentar(async () => {
      await habitacionesService.actualizar(id, aCuerpo(datos));
      await recargar();
    });
  }

  function cambiarEstado(id: number, estado: EstadoHabitacion) {
    return intentar(async () => {
      await habitacionesService.cambiarEstado(id, estado);
      await recargar();
    });
  }

  function eliminar(id: number) {
    return intentar(async () => {
      await habitacionesService.eliminar(id);
      await recargar();
    });
  }

  return {
    habitaciones,
    cargando,
    error,
    recargar,
    agregar,
    actualizar,
    cambiarEstado,
    eliminar,
  };
}