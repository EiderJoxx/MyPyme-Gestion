import { useLocalStorage } from "./useLocalStorage";
import { reservasIniciales } from "../data/datosPrueba";
import type { EstadoReserva, Reserva } from "../types";

export function useReservas() {
  const [reservas, setReservas] = useLocalStorage<Reserva[]>(
    "mypyme_reservas",
    reservasIniciales,
  );

  function crear(datos: Omit<Reserva, "id">) {
    setReservas((prev) => [...prev, { ...datos, id: Date.now() }]);
  }

  function actualizar(id: number, datos: Omit<Reserva, "id">) {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...datos, id } : r)),
    );
  }

  function cambiarEstado(id: number, estado: EstadoReserva) {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado } : r)),
    );
  }

  function abonar(id: number, monto: number) {
    setReservas((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, anticipo: r.anticipo + monto } : r,
      ),
    );
  }

  function eliminar(id: number) {
    setReservas((prev) => prev.filter((r) => r.id !== id));
  }

  return { reservas, crear, actualizar, cambiarEstado, abonar, eliminar };
}
