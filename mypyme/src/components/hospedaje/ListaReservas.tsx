import { useState } from "react";
import type { EstadoReserva, Habitacion, Reserva } from "../../types";
import { dinero } from "../../utils/formato";
import { formatoFecha, hoyISO } from "../../utils/fechas";
import { noches, totalHospedaje } from "../../utils/reservas";

interface Props {
  reservas: Reserva[];
  habitaciones: Habitacion[];
  onConfirmar: (id: number) => void;
  onCheckIn: (r: Reserva) => void;
  onCheckOut: (r: Reserva) => void;
  onCancelar: (r: Reserva) => void;
  onAbonar: (r: Reserva, monto: number) => void;
  onEditar: (r: Reserva) => void;
  onEliminar: (r: Reserva) => void;
}

type Filtro = "Por llegar" | "En casa" | "Finalizadas" | "Canceladas" | "Todas";

const FILTROS: Filtro[] = [
  "Por llegar",
  "En casa",
  "Finalizadas",
  "Canceladas",
  "Todas",
];

const ESTADOS_DEL_FILTRO: Record<Filtro, EstadoReserva[]> = {
  "Por llegar": ["Pendiente", "Confirmada"],
  "En casa": ["CheckIn"],
  Finalizadas: ["CheckOut"],
  Canceladas: ["Cancelada"],
  Todas: ["Pendiente", "Confirmada", "CheckIn", "CheckOut", "Cancelada"],
};

const ETIQUETA: Record<EstadoReserva, string> = {
  Pendiente: "Pendiente",
  Confirmada: "Confirmada",
  CheckIn: "En casa",
  CheckOut: "Finalizada",
  Cancelada: "Cancelada",
};

const COLOR: Record<EstadoReserva, string> = {
  Pendiente: "text-bg-warning",
  Confirmada: "text-bg-primary",
  CheckIn: "text-bg-success",
  CheckOut: "text-bg-secondary",
  Cancelada: "text-bg-danger",
};

export default function ListaReservas({
  reservas,
  habitaciones,
  onConfirmar,
  onCheckIn,
  onCheckOut,
  onCancelar,
  onAbonar,
  onEditar,
  onEliminar,
}: Props) {
  const [filtro, setFiltro] = useState<Filtro>("Por llegar");
  const [busqueda, setBusqueda] = useState("");
  const hoy = hoyISO();

  const numeroHab = (id: number) =>
    habitaciones.find((h) => h.id === id)?.numero ?? "?";
  const tipoHab = (id: number) =>
    habitaciones.find((h) => h.id === id)?.tipo ?? "";

  const texto = busqueda.toLowerCase();
  const visibles = reservas
    .filter((r) => ESTADOS_DEL_FILTRO[filtro].includes(r.estado))
    .filter(
      (r) =>
        r.cliente.toLowerCase().includes(texto) ||
        r.documento.includes(busqueda) ||
        numeroHab(r.habitacionId).includes(busqueda),
    )
    .sort((a, b) =>
      filtro === "Por llegar" || filtro === "En casa"
        ? a.checkIn.localeCompare(b.checkIn)
        : b.checkIn.localeCompare(a.checkIn),
    );

  function abonar(r: Reserva, saldo: number) {
    const entrada = window.prompt(
      `Monto del abono (saldo pendiente: ${dinero(saldo)})`,
    );
    if (entrada === null) return;
    const monto = Number(entrada.replace(/[^\d]/g, ""));
    if (!monto) return window.alert("Escribe un monto válido");
    if (monto > saldo)
      return window.alert("El abono supera el saldo pendiente");
    onAbonar(r, monto);
  }

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        {FILTROS.map((f) => (
          <button
            key={f}
            type="button"
            className={
              filtro === f
                ? "btn btn-sm btn-primary"
                : "btn btn-sm btn-outline-secondary"
            }
            onClick={() => setFiltro(f)}
          >
            {f} (
            {
              reservas.filter((r) => ESTADOS_DEL_FILTRO[f].includes(r.estado))
                .length
            }
            )
          </button>
        ))}
        <input
          className="form-control form-control-sm ms-auto"
          style={{ maxWidth: 220 }}
          placeholder="Buscar huésped o habitación..."
          aria-label="Buscar reserva"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {visibles.length === 0 ? (
        <div className="alert alert-light border">
          No hay reservas en esta vista.
        </div>
      ) : (
        <div className="row g-3">
          {visibles.map((r) => {
            const total = totalHospedaje(r);
            const saldo = total - r.anticipo;
            const activa =
              r.estado === "Pendiente" ||
              r.estado === "Confirmada" ||
              r.estado === "CheckIn";
            const vencida =
              (r.estado === "Pendiente" || r.estado === "Confirmada") &&
              r.checkIn < hoy;

            return (
              <div key={r.id} className="col-xl-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <h3 className="h6 mb-0">{r.cliente}</h3>
                      <span className={`badge ${COLOR[r.estado]}`}>
                        {ETIQUETA[r.estado]}
                      </span>
                    </div>

                    <p className="small text-secondary mb-2">
                      Hab. {numeroHab(r.habitacionId)} ·{" "}
                      {tipoHab(r.habitacionId)} · {r.personas}{" "}
                      {r.personas === 1 ? "persona" : "personas"}
                      {r.telefono && ` · Tel. ${r.telefono}`}
                    </p>

                    <p className="mb-2">
                      {formatoFecha(r.checkIn)} → {formatoFecha(r.checkOut)}{" "}
                      <span className="text-secondary">
                        ({noches(r)} {noches(r) === 1 ? "noche" : "noches"})
                      </span>{" "}
                      {vencida && (
                        <span className="badge text-bg-danger">
                          Llegada vencida
                        </span>
                      )}
                    </p>

                    {r.notas && (
                      <p className="small fst-italic text-secondary mb-2">
                        Nota: {r.notas}
                      </p>
                    )}

                    <div className="small border-top pt-2 mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Hospedaje</span>
                        <span>{dinero(total)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Pagado</span>
                        <span>{dinero(r.anticipo)}</span>
                      </div>
                      <div className="d-flex justify-content-between fw-semibold">
                        <span>Saldo</span>
                        <span
                          className={saldo > 0 ? "text-danger" : "text-success"}
                        >
                          {dinero(saldo)}
                        </span>
                      </div>
                    </div>

                    {activa && (
                      <div className="d-flex flex-wrap gap-2 mt-auto">
                        {r.estado === "Pendiente" && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onConfirmar(r.id)}
                          >
                            Confirmar
                          </button>
                        )}
                        {r.estado === "Confirmada" && (
                          <button
                            className="btn btn-success btn-sm"
                            disabled={r.checkIn > hoy}
                            title={
                              r.checkIn > hoy
                                ? "Disponible desde la fecha de entrada"
                                : ""
                            }
                            onClick={() => onCheckIn(r)}
                          >
                            Check-in
                          </button>
                        )}
                        {r.estado === "CheckIn" && (
                          <button
                            className="btn btn-dark btn-sm"
                            onClick={() => onCheckOut(r)}
                          >
                            Check-out
                          </button>
                        )}
                        {saldo > 0 && (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => abonar(r, saldo)}
                          >
                            Registrar abono
                          </button>
                        )}
                        {(r.estado === "Pendiente" ||
                          r.estado === "Confirmada") && (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => onEditar(r)}
                          >
                            Editar
                          </button>
                        )}
                        {r.estado !== "CheckIn" && (
                          <button
                            className="btn btn-outline-danger btn-sm ms-auto"
                            onClick={() => onCancelar(r)}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    )}

                    {!activa && (
                      <div className="mt-auto">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onEliminar(r)}
                        >
                          Eliminar del historial
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
