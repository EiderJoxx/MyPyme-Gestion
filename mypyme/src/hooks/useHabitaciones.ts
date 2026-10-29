import { useLocalStorage } from "./useLocalStorage";
import { habitaciones as iniciales } from "../data/datosPrueba";
import type { EstadoHabitacion, Habitacion } from "../types";

export function useHabitaciones() {
  const [habitaciones, setHabitaciones] = useLocalStorage<Habitacion[]>(
    "mypyme_habitaciones",
    iniciales,
  );

  function agregar(nueva: Omit<Habitacion, "id">) {
    setHabitaciones((prev) => [...prev, { ...nueva, id: Date.now() }]);
  }

  function actualizar(id: number, datos: Omit<Habitacion, "id">) {
    setHabitaciones((prev) =>
      prev.map((h) => (h.id === id ? { ...datos, id } : h)),
    );
  }

  function cambiarEstado(id: number, estado: EstadoHabitacion) {
    setHabitaciones((prev) =>
      prev.map((h) => (h.id === id ? { ...h, estado } : h)),
    );
  }

  function eliminar(id: number) {
    setHabitaciones((prev) => prev.filter((h) => h.id !== id));
  }

  return { habitaciones, agregar, actualizar, cambiarEstado, eliminar };
}
