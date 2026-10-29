import { useState } from "react";
import type { EstadoReserva, Habitacion, Reserva } from "../../types";
import {
  etiquetaDia,
  formatoFecha,
  hoyISO,
  sumarDias,
} from "../../utils/fechas";
import { ocupa } from "../../utils/reservas";

interface Props {
  habitaciones: Habitacion[];
  reservas: Reserva[];
}

const DIAS = 14;

const CLASE: Partial<Record<EstadoReserva, string>> = {
  CheckIn: "table-success",
  Confirmada: "table-primary",
  Pendiente: "table-warning",
};

export default function CalendarioOcupacion({ habitaciones, reservas }: Props) {
  const hoy = hoyISO();
  const [desde, setDesde] = useState(hoy);

  const dias = Array.from({ length: DIAS }, (_, i) => sumarDias(desde, i));
  const ordenadas = [...habitaciones].sort((a, b) =>
    a.numero.localeCompare(b.numero, undefined, { numeric: true }),
  );

  const reservaEn = (habitacionId: number, dia: string) =>
    reservas.find(
      (r) =>
        r.habitacionId === habitacionId &&
        ocupa(r) &&
        r.checkIn <= dia &&
        dia < r.checkOut,
    );

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setDesde(sumarDias(desde, -7))}
          >
            ← Anterior
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setDesde(hoy)}
          >
            Hoy
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setDesde(sumarDias(desde, 7))}
          >
            Siguiente →
          </button>
          <strong className="ms-2">
            {formatoFecha(dias[0])} – {formatoFecha(dias[DIAS - 1])}
          </strong>
          <div className="ms-auto small d-flex gap-3">
            <span>
              <span className="badge text-bg-success">&nbsp;</span> En casa
            </span>
            <span>
              <span className="badge text-bg-primary">&nbsp;</span> Confirmada
            </span>
            <span>
              <span className="badge text-bg-warning">&nbsp;</span> Pendiente
            </span>
          </div>
        </div>

        {ordenadas.length === 0 ? (
          <div className="alert alert-light border mb-0">
            Agrega habitaciones para ver la ocupación.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle mb-0 text-center">
              <thead>
                <tr>
                  <th className="text-start">Hab.</th>
                  {dias.map((d) => {
                    const { semana, dia } = etiquetaDia(d);
                    return (
                      <th
                        key={d}
                        className={d === hoy ? "table-dark" : ""}
                        style={{ minWidth: 56 }}
                      >
                        <div className="small fw-normal">{semana}</div>
                        <div>{dia}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {ordenadas.map((h) => (
                  <tr key={h.id}>
                    <td className="text-start">
                      <strong>{h.numero}</strong>{" "}
                      <small className="text-secondary">{h.tipo}</small>
                      {h.estado === "Mantenimiento" && (
                        <span className="badge text-bg-secondary ms-1">
                          Mant.
                        </span>
                      )}
                    </td>
                    {dias.map((d) => {
                      const r = reservaEn(h.id, d);
                      return (
                        <td
                          key={d}
                          className={r ? CLASE[r.estado] : ""}
                          title={
                            r
                              ? `${r.cliente} (${formatoFecha(r.checkIn)} → ${formatoFecha(r.checkOut)})`
                              : "Libre"
                          }
                        >
                          {r && (d === r.checkIn || d === dias[0]) && (
                            <div
                              className="text-truncate small"
                              style={{ maxWidth: 60 }}
                            >
                              {r.cliente.split(" ")[0]}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
