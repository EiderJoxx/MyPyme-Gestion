import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  clave: string,
  inicial: T | (() => T),
  normalizar?: (valor: T) => T,
) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const guardado = localStorage.getItem(clave);
      if (guardado) {
        const dato = JSON.parse(guardado) as T;
        return normalizar ? normalizar(dato) : dato;
      }
    } catch {}
    return typeof inicial === "function"
      ? (inicial as () => T)()
      : (inicial as T);
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
