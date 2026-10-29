import { useState } from "react";
import type { EstadoHabitacion, Habitacion, Reserva } from "../../types";
import { ESTADOS_HABITACION } from "../../data/constantes";
import { useHabitaciones } from "../../hooks/useHabitaciones";
import { useReservas } from "../../hooks/useReservas";
import { hoyISO } from "../../utils/fechas";
import { dinero } from "../../utils/formato";
import { ocupa, totalHospedaje } from "../../utils/reservas";
import FormularioHabitacion from "../../components/hospedaje/FormularioHabitacion";
import TablaHabitaciones from "../../components/hospedaje/TablaHabitaciones";
import FormularioReserva from "../../components/hospedaje/FormularioReserva";
import ListaReservas from "../../components/hospedaje/ListaReservas";
import CalendarioOcupacion from "../../components/hospedaje/CalendarioOcupacion";

type Pestana = "reservas" | "habitaciones" | "ocupacion";
type FiltroEstado = "Todas" | EstadoHabitacion;
type Aviso = { tipo: "success" | "warning" | "danger"; texto: string };

export default function Hospedaje() {
  const hab = useHabitaciones();
  const res = useReservas();
  const { habitaciones } = hab;
  const { reservas } = res;

  const [pestana, setPestana] = useState<Pestana>("reservas");
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [editandoHab, setEditandoHab] = useState<Habitacion | null>(null);
  const [editandoRes, setEditandoRes] = useState<Reserva | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("Todas");

  const hoy = hoyISO();
  const numeroHab = (id: number) =>
    habitaciones.find((h) => h.id === id)?.numero ?? "?";

  function avisar(tipo: Aviso["tipo"], texto: string) {
    setAviso({ tipo, texto });
    setTimeout(() => setAviso(null), 6000);
  }

  // ---------- Habitaciones ----------
  function guardarHabitacion(datos: Omit<Habitacion, "id">, id?: number) {
    if (id) {
      hab.actualizar(id, datos);
      avisar("success", `Habitación ${datos.numero} actualizada.`);
    } else {
      hab.agregar(datos);
      avisar("success", `Habitación ${datos.numero} agregada.`);
    }
    setEditandoHab(null);
  }

  function editarHabitacion(h: Habitacion) {
    setEditandoHab(h);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function eliminarHabitacion(h: Habitacion) {
    if (reservas.some((r) => r.habitacionId === h.id && ocupa(r))) {
      return avisar(
        "warning",
        `La habitación ${h.numero} tiene reservas activas. Cancélalas o finalízalas antes de eliminarla.`,
      );
    }
    if (!window.confirm(`¿Eliminar la habitación ${h.numero}?`)) return;
    hab.eliminar(h.id);
    if (editandoHab?.id === h.id) setEditandoHab(null);
    avisar("success", `Habitación ${h.numero} eliminada.`);
  }

  // ---------- Reservas ----------
  function guardarReserva(datos: Omit<Reserva, "id">, id?: number) {
    if (id) {
      res.actualizar(id, datos);
      avisar("success", `Reserva de ${datos.cliente} actualizada.`);
    } else {
      res.crear(datos);
      avisar(
        "success",
        `Reserva creada para ${datos.cliente} (habitación ${numeroHab(datos.habitacionId)}).`,
      );
    }
    setEditandoRes(null);
  }

  function editarReserva(r: Reserva) {
    setEditandoRes(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmar(id: number) {
    res.cambiarEstado(id, "Confirmada");
    avisar("success", "Reserva confirmada.");
  }

  function hacerCheckIn(r: Reserva) {
    const h = habitaciones.find((x) => x.id === r.habitacionId);
    if (!h)
      return avisar("danger", "La habitación de esta reserva ya no existe.");
    if (h.estado !== "Disponible") {
      return avisar(
        "warning",
        `La habitación ${h.numero} está en estado "${h.estado}". Debe estar Disponible para hacer el check-in.`,
      );
    }
    res.cambiarEstado(r.id, "CheckIn");
    hab.cambiarEstado(h.id, "Ocupada");
    avisar("success", `Check-in de ${r.cliente} en la habitación ${h.numero}.`);
  }

  function hacerCheckOut(r: Reserva) {
    const saldo = totalHospedaje(r) - r.anticipo;
    if (
      saldo > 0 &&
      !window.confirm(
        `Queda un saldo de ${dinero(saldo)}. ¿Hacer el check-out de todos modos?`,
      )
    )
      return;
    res.cambiarEstado(r.id, "CheckOut");
    hab.cambiarEstado(r.habitacionId, "Limpieza");
    avisar(
      "success",
      `Check-out de ${r.cliente}. La habitación ${numeroHab(r.habitacionId)} pasó a limpieza.`,
    );
  }

  function cancelar(r: Reserva) {
    if (!window.confirm(`¿Cancelar la reserva de ${r.cliente}?`)) return;
    res.cambiarEstado(r.id, "Cancelada");
    avisar("warning", "Reserva cancelada.");
  }

  function abonar(r: Reserva, monto: number) {
    res.abonar(r.id, monto);
    avisar("success", `Abono de ${dinero(monto)} registrado.`);
  }

  function eliminarReserva(r: Reserva) {
    if (
      !window.confirm(
        `¿Eliminar del historial la reserva de ${r.cliente}? No se puede deshacer.`,
      )
    )
      return;
    res.eliminar(r.id);
    if (editandoRes?.id === r.id) setEditandoRes(null);
    avisar("success", "Reserva eliminada del historial.");
  }

  // ---------- Resumen ----------
  const llegadasHoy = reservas.filter(
    (r) =>
      r.checkIn === hoy &&
      (r.estado === "Pendiente" || r.estado === "Confirmada"),
  ).length;
  const salidasHoy = reservas.filter(
    (r) => r.checkOut === hoy && r.estado === "CheckIn",
  ).length;
  const enCasa = reservas.filter((r) => r.estado === "CheckIn").length;
  const ocupacion = habitaciones.length
    ? Math.round((enCasa / habitaciones.length) * 100)
    : 0;
  const reservasActivas = reservas.filter(ocupa).length;

  // ---------- Filtro de habitaciones ----------
  const ordenadas = [...habitaciones].sort((a, b) =>
    a.numero.localeCompare(b.numero, undefined, { numeric: true }),
  );
  const habitacionesVisibles =
    filtroEstado === "Todas"
      ? ordenadas
      : ordenadas.filter((h) => h.estado === filtroEstado);
  const filtros: FiltroEstado[] = ["Todas", ...ESTADOS_HABITACION];
  const contar = (f: FiltroEstado) =>
    f === "Todas"
      ? habitaciones.length
      : habitaciones.filter((h) => h.estado === f).length;

  return (
    <div>
      <div className="mb-4">
        <h1 className="mb-1">Hospedaje</h1>
        <p className="text-secondary mb-0">
          Habitaciones, reservas, check-in, check-out y ocupación en un solo
          lugar.
        </p>
      </div>

      {aviso && (
        <div
          className={`alert alert-${aviso.tipo} d-flex justify-content-between align-items-center`}
          role="alert"
        >
          <span>{aviso.texto}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={() => setAviso(null)}
          ></button>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Llegadas hoy</p>
            <p className="tarjeta-valor">{llegadasHoy}</p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Salidas hoy</p>
            <p className="tarjeta-valor">{salidasHoy}</p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Huéspedes en casa</p>
            <p className="tarjeta-valor">{enCasa}</p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Ocupación</p>
            <p className="tarjeta-valor">{ocupacion}%</p>
            <p className="tarjeta-detalle">
              {enCasa} de {habitaciones.length} habitaciones
            </p>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={pestana === "reservas" ? "nav-link active" : "nav-link"}
            onClick={() => setPestana("reservas")}
          >
            Reservas{" "}
            <span className="badge text-bg-secondary">{reservasActivas}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={
              pestana === "habitaciones" ? "nav-link active" : "nav-link"
            }
            onClick={() => setPestana("habitaciones")}
          >
            Habitaciones{" "}
            <span className="badge text-bg-secondary">
              {habitaciones.length}
            </span>
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={pestana === "ocupacion" ? "nav-link active" : "nav-link"}
            onClick={() => setPestana("ocupacion")}
          >
            Ocupación (14 días)
          </button>
        </li>
      </ul>

      {pestana === "reservas" && (
        <div className="row g-4">
          <div className="col-lg-4">
            <FormularioReserva
              key={editandoRes?.id ?? "nueva"}
              editando={editandoRes}
              habitaciones={habitaciones}
              reservas={reservas}
              onGuardar={guardarReserva}
              onCancelar={() => setEditandoRes(null)}
            />
          </div>
          <div className="col-lg-8">
            <ListaReservas
              reservas={reservas}
              habitaciones={habitaciones}
              onConfirmar={confirmar}
              onCheckIn={hacerCheckIn}
              onCheckOut={hacerCheckOut}
              onCancelar={cancelar}
              onAbonar={abonar}
              onEditar={editarReserva}
              onEliminar={eliminarReserva}
            />
          </div>
        </div>
      )}

      {pestana === "habitaciones" && (
        <div className="row g-4">
          <div className="col-lg-4">
            <FormularioHabitacion
              key={editandoHab?.id ?? "nueva"}
              editando={editandoHab}
              numerosExistentes={habitaciones.map((h) => h.numero)}
              onGuardar={guardarHabitacion}
              onCancelar={() => setEditandoHab(null)}
            />
          </div>
          <div className="col-lg-8">
            <div className="d-flex flex-wrap gap-2 mb-3">
              {filtros.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={
                    filtroEstado === f
                      ? "btn btn-sm btn-primary"
                      : "btn btn-sm btn-outline-secondary"
                  }
                  onClick={() => setFiltroEstado(f)}
                >
                  {f} ({contar(f)})
                </button>
              ))}
            </div>
            <TablaHabitaciones
              habitaciones={habitacionesVisibles}
              reservas={reservas}
              onEditar={editarHabitacion}
              onCambiarEstado={hab.cambiarEstado}
              onEliminar={eliminarHabitacion}
            />
          </div>
        </div>
      )}

      {pestana === "ocupacion" && (
        <CalendarioOcupacion habitaciones={habitaciones} reservas={reservas} />
      )}
    </div>
  );
}
