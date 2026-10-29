import { useLocalStorage } from "./useLocalStorage";
import { gastosIniciales } from "../data/datosPrueba";
import type { Gasto } from "../types";

export function useGastos() {
  const [gastos, setGastos] = useLocalStorage<Gasto[]>(
    "mypyme_gastos",
    gastosIniciales,
  );

  function guardar(datos: Omit<Gasto, "id">, id?: number) {
    if (id)
      setGastos((prev) =>
        prev.map((g) => (g.id === id ? { ...datos, id } : g)),
      );
    else setGastos((prev) => [...prev, { ...datos, id: Date.now() }]);
  }

  function eliminar(id: number) {
    setGastos((prev) => prev.filter((g) => g.id !== id));
  }

  return { gastos, guardar, eliminar };
}
