import { useState } from "react";
import type { EstadoOrden, ItemOrden, Orden, Plato } from "../../types";
import { CATEGORIAS_PLATO } from "../../data/constantes";
import { platos as platosIniciales } from "../../data/datosPrueba";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { dinero } from "../../utils/formato";
import FormularioPlato from "../../components/restaurante/FormularioPlato";
import TarjetaPlato from "../../components/restaurante/TarjetaPlato";
import NuevaOrden from "../../components/restaurante/NuevaOrden";
import ListaOrdenes, {
  totalOrden,
} from "../../components/restaurante/ListaOrdenes";

type Pestana = "ordenes" | "menu";

export default function Restaurante() {
  const [platos, setPlatos] = useLocalStorage<Plato[]>(
    "mypyme_platos",
    platosIniciales,
  );
  const [ordenes, setOrdenes] = useLocalStorage<Orden[]>("mypyme_ordenes", []);
  const [pestana, setPestana] = useState<Pestana>("ordenes");
  const [categoria, setCategoria] = useState("Todas");

  function agregarPlato(nuevo: Omit<Plato, "id">) {
    setPlatos((prev) => [...prev, { ...nuevo, id: Date.now() }]);
  }

  function eliminarPlato(id: number) {
    setPlatos((prev) => prev.filter((p) => p.id !== id));
  }

  function crearOrden(mesa: number, items: ItemOrden[]) {
    const nueva: Orden = {
      id: Date.now(),
      mesa,
      fecha: new Date().toISOString(),
      items,
      estado: "Abierta",
    };
    setOrdenes((prev) => [...prev, nueva]);
  }

  function cambiarEstadoOrden(id: number, estado: EstadoOrden) {
    setOrdenes((prev) => prev.map((o) => (o.id === id ? { ...o, estado } : o)));
  }

  const hoy = new Date().toLocaleDateString("en-CA");
  const ventasHoy = ordenes
    .filter(
      (o) =>
        o.estado === "Cerrada" &&
        new Date(o.fecha).toLocaleDateString("en-CA") === hoy,
    )
    .reduce((suma, o) => suma + totalOrden(o), 0);
  const abiertas = ordenes.filter((o) => o.estado === "Abierta").length;

  const categorias = ["Todas", ...CATEGORIAS_PLATO];
  const platosVisibles =
    categoria === "Todas"
      ? platos
      : platos.filter((p) => p.categoria === categoria);

  return (
    <div>
      <h1>Restaurante</h1>
      <p className="text-secondary">
        Administra el menú y las órdenes de las mesas.
      </p>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Órdenes abiertas</p>
            <p className="tarjeta-valor">{abiertas}</p>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Ventas de hoy</p>
            <p className="tarjeta-valor">{dinero(ventasHoy)}</p>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Platos en el menú</p>
            <p className="tarjeta-valor">{platos.length}</p>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={pestana === "ordenes" ? "nav-link active" : "nav-link"}
            onClick={() => setPestana("ordenes")}
          >
            Órdenes
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={pestana === "menu" ? "nav-link active" : "nav-link"}
            onClick={() => setPestana("menu")}
          >
            Menú
          </button>
        </li>
      </ul>

      {pestana === "ordenes" ? (
        <div className="row g-4">
          <div className="col-lg-5">
            <NuevaOrden platos={platos} onCrear={crearOrden} />
          </div>
          <div className="col-lg-7">
            <ListaOrdenes
              ordenes={ordenes}
              onCambiarEstado={cambiarEstadoOrden}
            />
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-4">
            <FormularioPlato onAgregar={agregarPlato} />
          </div>
          <div className="col-lg-8">
            <div className="d-flex flex-wrap gap-2 mb-3">
              {categorias.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={
                    categoria === c
                      ? "btn btn-sm btn-primary"
                      : "btn btn-sm btn-outline-secondary"
                  }
                  onClick={() => setCategoria(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            {platosVisibles.length === 0 ? (
              <div className="alert alert-light border">
                No hay platos en esta categoría.
              </div>
            ) : (
              <div className="row g-3">
                {platosVisibles.map((p) => (
                  <div key={p.id} className="col-sm-6 col-xl-4">
                    <TarjetaPlato plato={p} onEliminar={eliminarPlato} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
