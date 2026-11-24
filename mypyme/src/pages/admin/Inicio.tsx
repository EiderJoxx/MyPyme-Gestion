import React, { useMemo } from "react";
import { TarjetaResumen } from "../../components/TarjetaResumen";
import { useGastos } from "../../hooks/useGastos";
import { useInventario } from "../../hooks/useInventario";
import { useRestauranteBar } from "../../hooks/useRestauranteBar";
import { useReservas } from "../../hooks/useReservas";
import { useAuth } from "../../auth/useAuth";
import { dinero } from "../../utils/formato";
import { esDeHoy, totalOrden } from "../../utils/ordenes"; // Asegúrate de que esta ruta sea correcta
import { ocupa } from "../../utils/reservas"; // Asegúrate de que esta ruta sea correcta

export const Inicio: React.FC = () => {
  const { gastos } = useGastos();
  const { insumos } = useInventario();
  const { ordenes } = useRestauranteBar();
  const { reservas } = useReservas();
  const { usuarios } = useAuth();

  // 1. Ventas del día (Restaurante + Bar)
  const ventasHoy = useMemo(() => {
    return ordenes
      .filter((o) => o.estado === "Cerrada" && esDeHoy(o.fecha))
      .reduce((suma, o) => suma + totalOrden(o), 0);
  }, [ordenes]);

  // 2. Insumos por agotarse
  const insumosBajos = useMemo(() => {
    return insumos.filter((i) => i.stock <= i.stockMinimo).length;
  }, [insumos]);

  // 3. Gastos totales del mes actual
  const gastosMes = useMemo(() => {
    return gastos.reduce((acc, g) => acc + g.monto, 0);
  }, [gastos]);

  // 4. Reservas activas (CheckIn o Confirmadas)
  const reservasActivas = useMemo(() => {
    return reservas.filter(ocupa).length;
  }, [reservas]);

  return (
    <div className="dashboard-inicio">
      <div className="mb-4">
        <h2 className="mb-1">Resumen de Gestión</h2>
        <p className="text-secondary mb-0">Vista rápida del estado de tu negocio hoy.</p>
      </div>

      <div className="row g-4 mt-2">
        {/* TARJETA 1: VENTAS */}
        <div className="col-md-6 col-xl-3">
          <TarjetaResumen
            titulo="Ventas de Hoy"
            valor={dinero(ventasHoy)}
            subtexto="Restaurante y Bar"
          />
        </div>

        {/* TARJETA 2: RESERVAS */}
        <div className="col-md-6 col-xl-3">
          <TarjetaResumen
            titulo="Reservas Activas"
            valor={reservasActivas.toString()}
            subtexto={`de ${reservas.length} en total`}
          />
        </div>

        {/* TARJETA 3: INVENTARIO */}
        <div className="col-md-6 col-xl-3">
          <TarjetaResumen
            titulo="Insumos en Stock"
            valor={insumos.length.toString()}
            tendencia={insumosBajos > 0 ? `${insumosBajos} por agotarse` : "Todo en orden"}
            esPositivo={insumosBajos === 0}
          />
        </div>

        {/* TARJETA 4: GASTOS Y USUARIOS */}
        <div className="col-md-6 col-xl-3">
          <TarjetaResumen
            titulo="Gastos del Mes"
            valor={dinero(gastosMes)}
            subtexto={`${usuarios.length} usuarios registrados`}
          />
        </div>
      </div>
    </div>
  );
};

export default Inicio;