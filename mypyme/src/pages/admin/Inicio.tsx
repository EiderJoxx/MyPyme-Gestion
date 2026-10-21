import React from "react";
import { TarjetaResumen } from "../../components/TarjetaResumen";

export const Inicio: React.FC = () => {
  return (
    <div className="dashboard-inicio">
      <h2>Resumen de Gestión</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <TarjetaResumen
          titulo="Ventas Totales"
          valor="$1,250,000"
          tendencia="+15%"
          esPositivo={true}
          subtexto="vs. mes anterior"
        />

        <TarjetaResumen
          titulo="Productos en Stock"
          valor="342"
          subtexto="20 sin inventario"
        />

        <TarjetaResumen
          titulo="Clientes Registrados"
          valor="89"
          tendencia="+5 esta semana"
          esPositivo={true}
        />

        <TarjetaResumen
          titulo="Gastos del Mes"
          valor="$430,000"
          tendencia="-3%"
          esPositivo={false}
          subtexto="vs. mes anterior"
        />
      </div>
    </div>
  );
};

export default Inicio;

/* import TarjetaResumen from "../../components/TarjetaResumen";
import { habitaciones, reservas } from "../../data/datosPrueba";

function dinero(valor: number) {
  return "$" + valor.toLocaleString("es-CO");
}

export default function Inicio() {
  const libres = habitaciones.filter((h) => h.estado === "Disponible").length;
  const ocupadas = habitaciones.filter((h) => h.estado === "Ocupada").length;

  const activas = reservas
    .filter((r) => r.estado !== "Cancelada" && r.estado !== "CheckOut")
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  const anticipos = activas.reduce((suma, r) => suma + r.anticipo, 0);

  function numeroHabitacion(id: number) {
    return habitaciones.find((h) => h.id === id)?.numero ?? "-";
  }

  return (
    <div>
      <h1>Resumen del negocio</h1>

      <section className="tarjetas">
        <TarjetaResumen
          titulo="Habitaciones libres"
          valor={libres}
          detalle={`de ${habitaciones.length} en total`}
        />
        <TarjetaResumen titulo="Habitaciones ocupadas" valor={ocupadas} />
        <TarjetaResumen titulo="Reservas activas" valor={activas.length} />
        <TarjetaResumen
          titulo="Anticipos recibidos"
          valor={dinero(anticipos)}
        />
      </section>

      <section className="panel">
        <h2>Próximas reservas</h2>
        <table className="tabla">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Habitación</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {activas.map((r) => (
              <tr key={r.id}>
                <td>{r.cliente}</td>
                <td>{numeroHabitacion(r.habitacionId)}</td>
                <td>{r.checkIn}</td>
                <td>{r.checkOut}</td>
                <td>{r.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
 */
