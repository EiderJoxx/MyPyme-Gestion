import { useState } from "react";
import type {
  EstadoHabitacion,
  Habitacion,
  HabitacionCreate,
  Reserva,
  ReservaCreate,
} from "../../types";
import { ESTADOS_HABITACION } from "../../data/constantes";
import { useHabitaciones } from "../../hooks/useHabitaciones";
import { useReservas } from "../../hooks/useReservas";
import { hoyISO } from "../../utils/fechas";
import { dinero } from "../../utils/formato";
import { ocupa } from "../../utils/reservas";
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

  // Muestra el éxito o el error del servidor; devuelve true si salió bien
  function resultado(
    err: string | null,
    textoOk: string,
    tipoOk: Aviso["tipo"] = "success",
  ): boolean {
    if (err) {
      avisar("danger", err);
      return false;
    }
    avisar(tipoOk, textoOk);
    return true;
  }

  // ---------- Habitaciones ----------
  async function guardarHabitacion(datos: HabitacionCreate, id?: number) {
    const err = id ? await hab.actualizar(id, datos) : await hab.agregar(datos);
    const ok = resultado(
      err,
      id
        ? `Habitación ${datos.numero} actualizada.`
        : `Habitación ${datos.numero} agregada.`,
    );
    if (ok) setEditandoHab(null);
  }

  function editarHabitacion(h: Habitacion) {
    setEditandoHab(h);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function cambiarEstadoHabitacion(id: number, estado: EstadoHabitacion) {
    const err = await hab.cambiarEstado(id, estado);
    if (err) avisar("danger", err);
  }

  async function eliminarHabitacion(h: Habitacion) {
    if (reservas.some((r) => r.habitacionId === h.id && ocupa(r))) {
      return avisar(
        "warning",
        `La habitación ${h.numero} tiene reservas activas. Cancélalas o finalízalas antes de eliminarla.`,
      );
    }
    if (!window.confirm(`¿Eliminar la habitación ${h.numero}?`)) return;
    const err = await hab.eliminar(h.id);
    if (resultado(err, `Habitación ${h.numero} eliminada.`) && editandoHab?.id === h.id)
      setEditandoHab(null);
  }

  // ---------- Reservas ----------
  async function guardarReserva(datos: ReservaCreate, id?: number) {
    const err = id ? await res.actualizar(id, datos) : await res.crear(datos);
    const ok = resultado(
      err,
      id
        ? `Reserva de ${datos.cliente} actualizada.`
        : `Reserva creada para ${datos.cliente} (habitación ${numeroHab(datos.habitacionId)}).`,
    );
    if (ok) setEditandoRes(null);
  }

  function editarReserva(r: Reserva) {
    setEditandoRes(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function confirmar(id: number) {
    const err = await res.cambiarEstado(id, "Confirmada");
    resultado(err, "Reserva confirmada.");
  }

  // El servidor pone la habitación en Ocupada; solo hay que recargarla
  async function hacerCheckIn(r: Reserva) {
    const h = habitaciones.find((x) => x.id === r.habitacionId);
    if (!h)
      return avisar("danger", "La habitación de esta reserva ya no existe.");
    if (h.estado !== "Disponible") {
      return avisar(
        "warning",
        `La habitación ${h.numero} está en estado "${h.estado}". Debe estar Disponible para hacer el check-in.`,
      );
    }
    const err = await res.cambiarEstado(r.id, "CheckIn");
    if (resultado(err, `Check-in de ${r.cliente} en la habitación ${h.numero}.`))
      await hab.recargar();
  }

  // El servidor pone la habitación en Limpieza; solo hay que recargarla
  async function hacerCheckOut(r: Reserva) {
    if (
      r.saldo > 0 &&
      !window.confirm(
        `Queda un saldo de ${dinero(r.saldo)}. ¿Hacer el check-out de todos modos?`,
      )
    )
      return;
    const err = await res.cambiarEstado(r.id, "CheckOut");
    const ok = resultado(
      err,
      `Check-out de ${r.cliente}. La habitación ${numeroHab(r.habitacionId)} pasó a limpieza.`,
    );
    if (ok) await hab.recargar();
  }

  async function cancelar(r: Reserva) {
    if (!window.confirm(`¿Cancelar la reserva de ${r.cliente}?`)) return;
    const err = await res.cambiarEstado(r.id, "Cancelada");
    resultado(err, "Reserva cancelada.", "warning");
  }

  async function abonar(r: Reserva, monto: number) {
    const err = await res.abonar(r.id, monto);
    resultado(err, `Abono de ${dinero(monto)} registrado.`);
  }

  async function eliminarReserva(r: Reserva) {
    if (
      !window.confirm(
        `¿Eliminar del historial la reserva de ${r.cliente}? No se puede deshacer.`,
      )
    )
      return;
    const err = await res.eliminar(r.id);
    if (resultado(err, "Reserva eliminada del historial.") && editandoRes?.id === r.id)
      setEditandoRes(null);
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
      {(hab.error || res.error) && (
        <div className="alert alert-danger" role="alert">
          {hab.error ?? res.error}
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
              onCambiarEstado={cambiarEstadoHabitacion}
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