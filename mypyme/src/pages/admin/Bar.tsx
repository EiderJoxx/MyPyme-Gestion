import { useEffect, useState } from "react";
import type { Bebida } from "../../types";
import FormularioBebida from "../../components/bar/FormularioBebida";
import TarjetaBebida from "../../components/bar/TarjetaBebida";

const CLAVE = "mypyme_bebidas";

function cargarBebidas(): Bebida[] {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

export default function Bar() {
  const [bebidas, setBebidas] = useState<Bebida[]>(cargarBebidas);

  // Cada vez que cambia la lista, se guarda en el navegador
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(bebidas));
    } catch {
      console.warn("No hay espacio para guardar más bebidas");
    }
  }, [bebidas]);

  function agregar(nueva: Omit<Bebida, "id">) {
    setBebidas((prev) => [...prev, { ...nueva, id: Date.now() }]);
  }

  function eliminar(id: number) {
    setBebidas((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div>
      <h1>Gestión de Bar</h1>
      <p className="text-secondary">Administra la carta de bebidas del bar.</p>

      <div className="row g-4">
        <div className="col-lg-4">
          <FormularioBebida onAgregar={agregar} />
        </div>

        <div className="col-lg-8">
          <h2 className="h5 mb-3">Carta de bebidas ({bebidas.length})</h2>

          {bebidas.length === 0 ? (
            <div className="alert alert-light border">
              Aún no hay bebidas. Agrega la primera con el formulario.
            </div>
          ) : (
            <div className="row g-3">
              {bebidas.map((b) => (
                <div key={b.id} className="col-sm-6 col-xl-4">
                  <TarjetaBebida bebida={b} onEliminar={eliminar} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
