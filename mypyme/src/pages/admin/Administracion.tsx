import { useState } from "react";
import type {
  DatosMovimiento,
  Gasto,
  Insumo,
  TipoMovimiento,
} from "../../types";
import { useInventario } from "../../hooks/useInventario";
import { useGastos } from "../../hooks/useGastos";
import { hoyISO } from "../../utils/fechas";
import { dinero } from "../../utils/formato";
import { calcularResumen, rangoDe } from "../../utils/finanzas";
import {
  leerMenuGuardado,
  leerOrdenesGuardadas,
  leerReservasGuardadas,
} from "../../utils/lecturas";
import FormularioInsumo from "../../components/administracion/FormularioInsumo";
import FormularioMovimiento from "../../components/administracion/FormularioMovimiento";
import TablaInventario from "../../components/administracion/TablaInventario";
import HistorialMovimientos from "../../components/administracion/HistorialMovimientos";
import FormularioGasto from "../../components/administracion/FormularioGasto";
import ListaGastos from "../../components/administracion/ListaGastos";
import PanelReportes from "../../components/administracion/PanelReportes";

type Pestana = "inventario" | "gastos" | "reportes";
type Aviso = { tipo: "success" | "warning" | "danger"; texto: string };

export default function Administracion() {
  const inv = useInventario();
  const gas = useGastos();
  // Datos de otros módulos: solo lectura
  const [menu] = useState(leerMenuGuardado);
  const [ordenes] = useState(leerOrdenesGuardadas);
  const [reservas] = useState(leerReservasGuardadas);

  const [pestana, setPestana] = useState<Pestana>("inventario");
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [editandoInsumo, setEditandoInsumo] = useState<Insumo | null>(null);
  const [movimiento, setMovimiento] = useState<{
    insumo: Insumo;
    tipo: TipoMovimiento;
  } | null>(null);
  const [editandoGasto, setEditandoGasto] = useState<Gasto | null>(null);

  function avisar(tipo: Aviso["tipo"], texto: string) {
    setAviso({ tipo, texto });
    setTimeout(() => setAviso(null), 6000);
  }

  const subirPagina = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ---------- Inventario ----------
  function guardarInsumo(datos: Omit<Insumo, "id">, id?: number) {
    inv.guardarInsumo(datos, id);
    setEditandoInsumo(null);
    avisar(
      "success",
      id
        ? `Insumo "${datos.nombre}" actualizado.`
        : `Insumo "${datos.nombre}" agregado.`,
    );
  }

  function eliminarInsumo(i: Insumo) {
    if (!window.confirm(`¿Eliminar "${i.nombre}" del inventario?`)) return;
    inv.eliminarInsumo(i.id);
    if (editandoInsumo?.id === i.id) setEditandoInsumo(null);
    if (movimiento?.insumo.id === i.id) setMovimiento(null);
    avisar("success", `Insumo "${i.nombre}" eliminado.`);
  }

  function editarInsumo(i: Insumo) {
    setMovimiento(null);
    setEditandoInsumo(i);
    subirPagina();
  }

  function abrirMovimiento(insumo: Insumo, tipo: TipoMovimiento) {
    setEditandoInsumo(null);
    setMovimiento({ insumo, tipo });
    subirPagina();
  }

  function guardarMovimiento(datos: DatosMovimiento) {
    if (!movimiento) return;
    const { insumo, tipo } = movimiento;
    const costoUnitario =
      tipo === "Entrada" && datos.costoTotal > 0
        ? datos.costoTotal / datos.cantidad
        : undefined;

    inv.registrarMovimiento(
      insumo.id,
      tipo,
      datos.cantidad,
      datos.detalle,
      costoUnitario,
    );

    if (tipo === "Entrada" && datos.costoTotal > 0) {
      gas.guardar({
        fecha: hoyISO(),
        categoria: "Compras de inventario",
        descripcion: `Compra de ${datos.cantidad} ${insumo.unidad} de ${insumo.nombre}`,
        proveedor: datos.proveedor,
        monto: datos.costoTotal,
      });
      avisar(
        "success",
        `Entrada registrada y gasto de ${dinero(datos.costoTotal)} creado.`,
      );
    } else {
      avisar("success", `${tipo} registrada en "${insumo.nombre}".`);
    }
    setMovimiento(null);
  }

  // ---------- Gastos ----------
  function guardarGasto(datos: Omit<Gasto, "id">, id?: number) {
    gas.guardar(datos, id);
    setEditandoGasto(null);
    avisar("success", id ? "Gasto actualizado." : "Gasto registrado.");
  }

  function eliminarGasto(g: Gasto) {
    if (!window.confirm(`¿Eliminar el gasto "${g.descripcion}"?`)) return;
    gas.eliminar(g.id);
    if (editandoGasto?.id === g.id) setEditandoGasto(null);
    avisar("success", "Gasto eliminado.");
  }

  function editarGasto(g: Gasto) {
    setEditandoGasto(g);
    subirPagina();
  }

  // ---------- Resumen ----------
  const valorInventario = inv.insumos.reduce(
    (suma, i) => suma + i.stock * i.costoUnitario,
    0,
  );
  const bajos = inv.insumos.filter((i) => i.stock <= i.stockMinimo).length;
  const mes = rangoDe("mes");
  const resumenMes = calcularResumen(
    ordenes,
    reservas,
    gas.gastos,
    mes.desde,
    mes.hasta,
  );

  return (
    <div>
      <div className="mb-4">
        <h1 className="mb-1">Administración</h1>
        <p className="text-secondary mb-0">
          Inventario, gastos y reportes del negocio.
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
            <p className="tarjeta-titulo">Valor del inventario</p>
            <p className="tarjeta-valor">
              {dinero(Math.round(valorInventario))}
            </p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Insumos por reponer</p>
            <p
              className={
                bajos > 0 ? "tarjeta-valor text-danger" : "tarjeta-valor"
              }
            >
              {bajos}
            </p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Gastos del mes</p>
            <p className="tarjeta-valor">{dinero(resumenMes.gastos)}</p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Utilidad del mes</p>
            <p
              className={
                resumenMes.utilidad < 0
                  ? "tarjeta-valor text-danger"
                  : "tarjeta-valor"
              }
            >
              {dinero(resumenMes.utilidad)}
            </p>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        {(["inventario", "gastos", "reportes"] as Pestana[]).map((p) => (
          <li key={p} className="nav-item">
            <button
              type="button"
              className={pestana === p ? "nav-link active" : "nav-link"}
              onClick={() => setPestana(p)}
            >
              {p === "inventario"
                ? "Inventario"
                : p === "gastos"
                  ? "Gastos"
                  : "Reportes"}
              {p === "inventario" && bajos > 0 && (
                <span className="badge text-bg-danger ms-2">{bajos}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {pestana === "inventario" && (
        <div className="row g-4">
          <div className="col-lg-4">
            {movimiento ? (
              <FormularioMovimiento
                key={`${movimiento.insumo.id}-${movimiento.tipo}`}
                insumo={movimiento.insumo}
                tipo={movimiento.tipo}
                onGuardar={guardarMovimiento}
                onCancelar={() => setMovimiento(null)}
              />
            ) : (
              <FormularioInsumo
                key={editandoInsumo?.id ?? "nuevo"}
                editando={editandoInsumo}
                menu={menu}
                nombresExistentes={inv.insumos.map((i) => i.nombre)}
                onGuardar={guardarInsumo}
                onCancelar={() => setEditandoInsumo(null)}
              />
            )}
          </div>
          <div className="col-lg-8">
            <TablaInventario
              insumos={inv.insumos}
              menu={menu}
              onMovimiento={abrirMovimiento}
              onEditar={editarInsumo}
              onEliminar={eliminarInsumo}
            />
            <HistorialMovimientos movimientos={inv.movimientos} />
          </div>
        </div>
      )}

      {pestana === "gastos" && (
        <div className="row g-4">
          <div className="col-lg-4">
            <FormularioGasto
              key={editandoGasto?.id ?? "nuevo"}
              editando={editandoGasto}
              onGuardar={guardarGasto}
              onCancelar={() => setEditandoGasto(null)}
            />
          </div>
          <div className="col-lg-8">
            <ListaGastos
              gastos={gas.gastos}
              onEditar={editarGasto}
              onEliminar={eliminarGasto}
            />
          </div>
        </div>
      )}

      {pestana === "reportes" && (
        <PanelReportes
          ordenes={ordenes}
          reservas={reservas}
          gastos={gas.gastos}
          insumos={inv.insumos}
        />
      )}
    </div>
  );
}
