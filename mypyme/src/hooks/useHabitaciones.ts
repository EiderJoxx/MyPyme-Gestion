import { useEffect, useState } from "react";
import type { EstadoHabitacion, Habitacion } from "../types";
import { habitaciones as iniciales } from "../data/datosPrueba";

const CLAVE = "mypyme_habitaciones";

function cargar(): Habitacion[] {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? JSON.parse(guardado) : iniciales;
  } catch {
    return iniciales;
  }
}

export function useHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>(cargar);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(habitaciones));
    } catch {
      console.warn("No se pudieron guardar las habitaciones");
    }
  }, [habitaciones]);

  function agregar(nueva: Omit<Habitacion, "id">) {
    setHabitaciones((prev) => [...prev, { ...nueva, id: Date.now() }]);
  }

  function cambiarEstado(id: number, estado: EstadoHabitacion) {
    setHabitaciones((prev) =>
      prev.map((h) => (h.id === id ? { ...h, estado } : h)),
    );
  }

  function eliminar(id: number) {
    setHabitaciones((prev) => prev.filter((h) => h.id !== id));
  }

  return { habitaciones, agregar, cambiarEstado, eliminar };
}
