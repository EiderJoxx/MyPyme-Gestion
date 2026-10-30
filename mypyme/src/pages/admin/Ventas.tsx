import { useState } from "react";
import type { ItemMenu, MetodoPago } from "../../types";
import { useAuth } from "../../auth/useAuth";
import { useRestauranteBar } from "../../hooks/useRestauranteBar";
import { useInventario } from "../../hooks/useInventario";
import { dinero } from "../../utils/formato";
import { esDeHoy, totalOrden } from "../../utils/ordenes";
import { unidadesDisponibles } from "../../utils/disponibilidad";
import NuevaOrden from "../../components/restaurante/NuevaOrden";
import ListaOrdenes from "../../components/restaurante/ListaOrdenes";
import TablaDisponibilidad from "../../components/ventas/TablaDisponibilidad";

type Pestana = "pedidos" | "disponibilidad";

export default function Ventas() {
  const { usuario } = useAuth();
  const { menu, ordenes, guardarOrden, cobrar } = useRestauranteBar();
  const { insumos, descontarVenta } = useInventario();
  const [pestana, setPestana] = useState<Pestana>("pedidos");
  const [mesa, setMesa] = useState<number | null>(null);

  if (!usuario) return null;
  const esAdmin = usuario.rol === "Administrador";

  const visibles = esAdmin
    ? ordenes
    : ordenes.filter(
        (o) => o.estado === "Abierta" || o.vendedorId === usuario.id,
      );

  const abiertas = ordenes.filter((o) => o.estado === "Abierta");
  const misVentasHoy = ordenes.filter(
    (o) =>
      o.estado === "Cerrada" && o.vendedorId === usuario.id && esDeHoy(o.fecha),
  );
  const totalHoy = misVentasHoy.reduce((suma, o) => suma + totalOrden(o), 0);

  function alCobrar(id: number, metodo: MetodoPago) {
    const orden = ordenes.find((o) => o.id === id);
    cobrar(id, metodo);
    if (orden) descontarVenta(orden.items, `Venta mesa ${orden.mesa}`);
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="mb-1">Punto de venta</h1>
        <p className="text-secondary mb-0">
          Hola, {usuario.nombre}. Ingresa pedidos, consulta la disponibilidad y
          cobra.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Órdenes abiertas</p>
            <p className="tarjeta-valor">{abiertas.length}</p>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Mis ventas de hoy</p>
            <p className="tarjeta-valor">{misVentasHoy.length}</p>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Total vendido hoy</p>
            <p className="tarjeta-valor">{dinero(totalHoy)}</p>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={pestana === "pedidos" ? "nav-link active" : "nav-link"}
            onClick={() => setPestana("pedidos")}
          >
            Pedidos
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={
              pestana === "disponibilidad" ? "nav-link active" : "nav-link"
            }
            onClick={() => setPestana("disponibilidad")}
          >
            Disponibilidad
          </button>
        </li>
      </ul>

      {pestana === "pedidos" ? (
        <div className="row g-4">
          <div className="col-lg-5">
            <NuevaOrden
              menu={menu}
              mesa={mesa}
              mesasOcupadas={abiertas.map((o) => o.mesa)}
              limite={(m: ItemMenu) => unidadesDisponibles(m, insumos)}
              onMesaChange={setMesa}
              onGuardar={(m, items, nota) =>
                guardarOrden(m, items, nota, {
                  id: usuario.id,
                  nombre: usuario.nombre,
                })
              }
            />
          </div>
          <div className="col-lg-7">
            <ListaOrdenes
              ordenes={visibles}
              onCobrar={alCobrar}
              onAnular={() => {}}
              puedeAnular={false}
            />
          </div>
        </div>
      ) : (
        <TablaDisponibilidad menu={menu} insumos={insumos} />
      )}
    </div>
  );
}
