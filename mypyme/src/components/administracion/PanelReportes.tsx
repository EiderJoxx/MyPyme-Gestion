import { useState } from "react";
import type { Gasto, Insumo, Orden, Reserva } from "../../types";
import { dinero } from "../../utils/formato";
import { descargarCSV } from "../../utils/csv";
import {
  PERIODOS,
  calcularResumen,
  rangoDe,
  type Periodo,
} from "../../utils/finanzas";
import BarraProgreso from "./BarraProgreso";

interface Props {
  ordenes: Orden[];
  reservas: Reserva[];
  gastos: Gasto[];
  insumos: Insumo[];
}

export default function PanelReportes({
  ordenes,
  reservas,
  gastos,
  insumos,
}: Props) {
  const [periodo, setPeriodo] = useState<Periodo>("mes");

  const { desde, hasta } = rangoDe(periodo);
  const r = calcularResumen(ordenes, reservas, gastos, desde, hasta);
  const margen =
    r.ingresos > 0 ? Math.round((r.utilidad / r.ingresos) * 100) : 0;
  const bajos = insumos.filter((i) => i.stock <= i.stockMinimo);

  function exportar() {
    descargarCSV(`reporte-mypyme-${periodo}.csv`, [
      ["Fecha", "Tipo", "Concepto", "Monto"],
      ...r.movimientos.map((m) => [m.fecha, m.tipo, m.concepto, m.monto]),
    ]);
  }

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
        {PERIODOS.map((p) => (
          <button
            key={p.valor}
            type="button"
            className={
              periodo === p.valor
                ? "btn btn-sm btn-primary"
                : "btn btn-sm btn-outline-secondary"
            }
            onClick={() => setPeriodo(p.valor)}
          >
            {p.etiqueta}
          </button>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-success ms-auto"
          disabled={r.movimientos.length === 0}
          onClick={exportar}
        >
          Exportar CSV
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Ingresos</p>
            <p className="tarjeta-valor">{dinero(r.ingresos)}</p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Gastos</p>
            <p className="tarjeta-valor">{dinero(r.gastos)}</p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Utilidad</p>
            <p
              className={
                r.utilidad < 0 ? "tarjeta-valor text-danger" : "tarjeta-valor"
              }
            >
              {dinero(r.utilidad)}
            </p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Margen</p>
            <p className="tarjeta-valor">{margen}%</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6 mb-3">Ingresos por área</h2>
              <BarraProgreso
                etiqueta="Restaurante"
                valor={r.ventasRestaurante}
                total={r.ingresos}
                color="bg-warning"
              />
              <BarraProgreso
                etiqueta="Bar"
                valor={r.ventasBar}
                total={r.ingresos}
                color="bg-info"
              />
              <BarraProgreso
                etiqueta="Hospedaje (cobrado)"
                valor={r.hospedaje}
                total={r.ingresos}
                color="bg-success"
              />
              <small className="text-secondary">
                El hospedaje suma lo cobrado en anticipos y abonos, asignado a
                la fecha de entrada de cada reserva.
              </small>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6 mb-3">Gastos por categoría</h2>
              {r.gastosPorCategoria.length === 0 ? (
                <p className="text-secondary small mb-0">
                  No hay gastos en este período.
                </p>
              ) : (
                r.gastosPorCategoria.map((c) => (
                  <BarraProgreso
                    key={c.categoria}
                    etiqueta={c.categoria}
                    valor={c.monto}
                    total={r.gastos}
                    color="bg-danger"
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6 mb-3">Productos más vendidos</h2>
              {r.topProductos.length === 0 ? (
                <p className="text-secondary small mb-0">
                  No hay ventas cobradas en este período.
                </p>
              ) : (
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-end">Unidades</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.topProductos.map((p) => (
                      <tr key={p.nombre}>
                        <td>{p.nombre}</td>
                        <td className="text-end">{p.cantidad}</td>
                        <td className="text-end">{dinero(p.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {r.pagosPorMetodo.length > 0 && (
                <p className="small text-secondary mt-3 mb-0">
                  Por método de pago:{" "}
                  {r.pagosPorMetodo
                    .map(([metodo, monto]) => `${metodo} ${dinero(monto)}`)
                    .join(" · ")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6 mb-3">Insumos por reponer</h2>
              {bajos.length === 0 ? (
                <p className="text-secondary small mb-0">
                  Todo el inventario está por encima del mínimo.
                </p>
              ) : (
                <ul className="list-group list-group-flush">
                  {bajos.map((i) => (
                    <li
                      key={i.id}
                      className="list-group-item d-flex justify-content-between px-0"
                    >
                      <span>{i.nombre}</span>
                      <span
                        className={
                          i.stock <= 0
                            ? "text-danger fw-semibold"
                            : "text-warning fw-semibold"
                        }
                      >
                        {i.stock} / {i.stockMinimo} {i.unidad}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
