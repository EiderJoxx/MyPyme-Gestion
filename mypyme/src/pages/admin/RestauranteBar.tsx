import { useState } from "react";
import type { AreaMenu, ItemMenu, MetodoPago, ItemOrden } from "../../types";
import { AREAS, CATEGORIAS_MENU } from "../../data/constantes";
import { useRestauranteBar } from "../../hooks/useRestauranteBar";
import { dinero } from "../../utils/formato";
import { esDeHoy, totalOrden, totalOrdenPorArea } from "../../utils/ordenes";
import FormularioItem from "../../components/restaurante/FormularioItem";
import TarjetaItem from "../../components/restaurante/TarjetaItem";
import NuevaOrden from "../../components/restaurante/NuevaOrden";
import ListaOrdenes from "../../components/restaurante/ListaOrdenes";
import { useAuth } from "../../auth/useAuth";

type Pestana = "ordenes" | "menu";
type FiltroArea = "Todas" | AreaMenu;
type Aviso = { tipo: "success" | "danger"; texto: string };

export default function RestauranteBar() {
  const {
    menu,
    ordenes,
    cargando,
    error,
    guardarItem,
    eliminarItem,
    cambiarDisponible,
    guardarOrden,
    cobrar,
    anular,
  } = useRestauranteBar();

  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === "Administrador";

  const [pestana, setPestana] = useState<Pestana>("ordenes");
  const [mesa, setMesa] = useState<number | null>(null);
  const [editando, setEditando] = useState<ItemMenu | null>(null);
  const [filtroArea, setFiltroArea] = useState<FiltroArea>("Todas");
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [aviso, setAviso] = useState<Aviso | null>(null);

  function avisar(tipo: Aviso["tipo"], texto: string) {
    setAviso({ tipo, texto });
    setTimeout(() => setAviso(null), 6000);
  }

  function resultado(err: string | null, textoOk: string): boolean {
    if (err) {
      avisar("danger", err);
      return false;
    }
    avisar("success", textoOk);
    return true;
  }

  // --- ACCIONES DE ÓRDENES ---
  async function alGuardarOrden(m: number, items: ItemOrden[], nota: string): Promise<string | null> {
    const err = await guardarOrden(
      m, 
      items, 
      nota, 
      usuario ? { id: usuario.id, nombre: usuario.nombre } : undefined
    );
    resultado(err, "Orden guardada correctamente.");
    return err;
  }

  // CORRECCIÓN: Agregamos Promise<string | null> y el return
  async function alCobrar(id: number, metodo: MetodoPago): Promise<string | null> {
    const err = await cobrar(id, metodo);
    resultado(err, "Orden cobrada y stock descontado.");
    return err;
  }

  // CORRECCIÓN: Agregamos Promise<string | null> y el return
  async function alAnular(id: number): Promise<string | null> {
    const err = await anular(id);
    resultado(err, "Orden anulada correctamente.");
    return err;
  }

  // --- ACCIONES DEL MENÚ ---
  async function alGuardarItem(datos: Omit<ItemMenu, "id">, id?: number) {
    const err = await guardarItem(datos, id);
    if (resultado(err, id ? "Producto actualizado." : "Producto agregado."))
      setEditando(null);
  }

  async function alEliminarItem(id: number) {
    const err = await eliminarItem(id);
    if (resultado(err, "Producto eliminado.") && editando?.id === id)
      setEditando(null);
  }

  async function alCambiarDisponible(id: number) {
    const err = await cambiarDisponible(id);
    if (err) avisar("danger", err);
  }

  function alEditar(item: ItemMenu) {
    setEditando(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- CÁLCULOS ---
  const abiertas = ordenes.filter((o) => o.estado === "Abierta");
  const cerradasHoy = ordenes.filter(
    (o) => o.estado === "Cerrada" && esDeHoy(o.fecha),
  );
  const ventasHoy = cerradasHoy.reduce((suma, o) => suma + totalOrden(o), 0);
  const ventasRestaurante = cerradasHoy.reduce(
    (suma, o) => suma + totalOrdenPorArea(o, "Restaurante"),
    0,
  );
  const ventasBar = cerradasHoy.reduce(
    (suma, o) => suma + totalOrdenPorArea(o, "Bar"),
    0,
  );

  const itemsVisibles = menu
    .filter((m) => filtroArea === "Todas" || m.area === filtroArea)
    .filter((m) => categoria === "Todas" || m.categoria === categoria)
    .filter((m) => m.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort(
      (a, b) =>
        a.area.localeCompare(b.area) || a.nombre.localeCompare(b.nombre),
    );

  const filtrosArea: FiltroArea[] = ["Todas", ...AREAS];
  const categoriasArea =
    filtroArea === "Todas" ? [] : CATEGORIAS_MENU[filtroArea];

  function elegirArea(a: FiltroArea) {
    setFiltroArea(a);
    setCategoria("Todas");
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="mb-1">Restaurante y Bar</h1>
        <p className="text-secondary mb-0">
          Menú, pedidos por mesa y cobros en un solo lugar.
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
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {cargando && <p className="text-secondary">Cargando...</p>}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Órdenes abiertas</p>
            <p className="tarjeta-valor">{abiertas.length}</p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Ventas de hoy</p>
            <p className="tarjeta-valor">{dinero(ventasHoy)}</p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Restaurante hoy</p>
            <p className="tarjeta-valor">{dinero(ventasRestaurante)}</p>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="tarjeta">
            <p className="tarjeta-titulo">Bar hoy</p>
            <p className="tarjeta-valor">{dinero(ventasBar)}</p>
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
            Órdenes{" "}
            {abiertas.length > 0 && (
              <span className="badge text-bg-warning">{abiertas.length}</span>
            )}
          </button>
        </li>
        {esAdmin && (
          <li className="nav-item">
            <button
              type="button"
              className={pestana === "menu" ? "nav-link active" : "nav-link"}
              onClick={() => setPestana("menu")}
            >
              Menú <span className="badge text-bg-secondary">{menu.length}</span>
            </button>
          </li>
        )}
      </ul>

      {pestana === "ordenes" ? (
        <div className="row g-4">
          <div className="col-lg-5">
            <NuevaOrden
              menu={menu}
              mesa={mesa}
              mesasOcupadas={abiertas.map((o) => o.mesa)}
              onMesaChange={setMesa}
              onGuardar={alGuardarOrden}
            />
          </div>
          <div className="col-lg-7">
            <ListaOrdenes
              ordenes={ordenes}
              onCobrar={alCobrar}
              onAnular={alAnular}
              puedeAnular={esAdmin}
            />
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-4">
            <FormularioItem
              key={editando?.id ?? "nuevo"}
              editando={editando}
              onGuardar={alGuardarItem}
              onCancelar={() => setEditando(null)}
            />
          </div>

          <div className="col-lg-8">
            <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
              {filtrosArea.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={
                    filtroArea === a
                      ? "btn btn-sm btn-primary"
                      : "btn btn-sm btn-outline-secondary"
                  }
                  onClick={() => elegirArea(a)}
                >
                  {a}
                </button>
              ))}
              <input
                className="form-control form-control-sm ms-auto"
                style={{ maxWidth: 220 }}
                placeholder="Buscar en el menú..."
                aria-label="Buscar en el menú"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {categoriasArea.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {["Todas", ...categoriasArea].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={
                      categoria === c
                        ? "btn btn-sm btn-secondary"
                        : "btn btn-sm btn-outline-secondary"
                    }
                    onClick={() => setCategoria(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {itemsVisibles.length === 0 ? (
              <div className="alert alert-light border mt-3">
                No hay productos con estos filtros.
              </div>
            ) : (
              <div className="row g-3 mt-0">
                {itemsVisibles.map((m) => (
                  <div key={m.id} className="col-sm-6 col-xl-4">
                    <TarjetaItem
                      item={m}
                      onEditar={alEditar}
                      onEliminar={alEliminarItem}
                      onCambiarDisponible={alCambiarDisponible}
                    />
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