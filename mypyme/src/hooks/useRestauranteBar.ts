import { useLocalStorage } from "./useLocalStorage";
import { menuInicial } from "../data/datosPrueba";
import type { ItemMenu, ItemOrden, MetodoPago, Orden } from "../types";

interface ItemViejo {
  id: number;
  nombre: string;
  categoria?: string;
  precio: number;
  descripcion: string;
  foto: string;
}

function leer(clave: string): { existe: boolean; datos: ItemViejo[] } {
  try {
    const guardado = localStorage.getItem(clave);
    return {
      existe: guardado !== null,
      datos: guardado ? JSON.parse(guardado) : [],
    };
  } catch {
    return { existe: false, datos: [] };
  }
}

function crearMenuInicial(): ItemMenu[] {
  const platos = leer("mypyme_platos");
  const bebidas = leer("mypyme_bebidas");
  if (!platos.existe && bebidas.datos.length === 0) return menuInicial;

  return [
    ...platos.datos.map((p) => ({
      ...p,
      area: "Restaurante" as const,
      categoria: p.categoria ?? "Platos fuertes",
      disponible: true,
    })),
    ...bebidas.datos.map((b) => ({
      ...b,
      area: "Bar" as const,
      categoria: "Otras bebidas",
      disponible: true,
    })),
  ];
}

function normalizarOrdenes(ordenes: Orden[]): Orden[] {
  return ordenes.map((o) => ({
    ...o,
    nota: o.nota ?? "",
    items: o.items.map((i) => {
      const viejo = i as ItemOrden & { platoId?: number };
      return {
        ...i,
        itemId: i.itemId ?? viejo.platoId ?? 0,
        area: i.area ?? "Restaurante",
      };
    }),
  }));
}

export function useRestauranteBar() {
  const [menu, setMenu] = useLocalStorage<ItemMenu[]>(
    "mypyme_menu",
    crearMenuInicial,
  );
  const [ordenes, setOrdenes] = useLocalStorage<Orden[]>(
    "mypyme_ordenes",
    [],
    normalizarOrdenes,
  );

  function guardarItem(datos: Omit<ItemMenu, "id">, id?: number) {
    if (id) {
      setMenu((prev) => prev.map((m) => (m.id === id ? { ...datos, id } : m)));
    } else {
      setMenu((prev) => [...prev, { ...datos, id: Date.now() }]);
    }
  }

  function eliminarItem(id: number) {
    setMenu((prev) => prev.filter((m) => m.id !== id));
  }

  function cambiarDisponible(id: number) {
    setMenu((prev) =>
      prev.map((m) => (m.id === id ? { ...m, disponible: !m.disponible } : m)),
    );
  }

  function guardarOrden(
    mesa: number,
    items: ItemOrden[],
    nota: string,
    vendedor?: { id: number; nombre: string },
  ) {
    setOrdenes((prev) => {
      const abierta = prev.find(
        (o) => o.mesa === mesa && o.estado === "Abierta",
      );

      if (!abierta) {
        const nueva: Orden = {
          id: Date.now(),
          mesa,
          fecha: new Date().toISOString(),
          items,
          nota: nota.trim(),
          estado: "Abierta",
          vendedorId: vendedor?.id,
          vendedor: vendedor?.nombre,
        };
        return [...prev, nueva];
      }

      return prev.map((o) => {
        if (o.id !== abierta.id) return o;
        const combinados = [...o.items];
        items.forEach((nuevo) => {
          const pos = combinados.findIndex((x) => x.itemId === nuevo.itemId);
          if (pos >= 0) {
            combinados[pos] = {
              ...combinados[pos],
              cantidad: combinados[pos].cantidad + nuevo.cantidad,
            };
          } else {
            combinados.push(nuevo);
          }
        });
        const notas = [o.nota, nota.trim()].filter(Boolean).join(" · ");
        return { ...o, items: combinados, nota: notas };
      });
    });
  }

  function cobrar(id: number, metodoPago: MetodoPago) {
    setOrdenes((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, estado: "Cerrada", metodoPago } : o,
      ),
    );
  }

  function anular(id: number) {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, estado: "Anulada" } : o)),
    );
  }

  return {
    menu,
    ordenes,
    guardarItem,
    eliminarItem,
    cambiarDisponible,
    guardarOrden,
    cobrar,
    anular,
  };
}
