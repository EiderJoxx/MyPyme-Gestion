import { useEffect, useState } from "react";

export function useLocalStorage<T>(clave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const guardado = localStorage.getItem(clave);
      return guardado ? (JSON.parse(guardado) as T) : inicial;
    } catch {
      return inicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      console.warn("No hay espacio para guardar los datos");
    }
  }, [clave, valor]);

  return [valor, setValor] as const;
}
