import { useState } from "react";
import type { DatosFormularioUsuario, Usuario } from "../../types";
import { useAuth } from "../../auth/useAuth";
import FormularioUsuario from "../../components/usuarios/FormularioUsuario";
import TablaUsuarios from "../../components/usuarios/TablaUsuarios";

type Aviso = { tipo: "success" | "danger"; texto: string };

export default function Usuarios() {
  const {
    usuario,
    usuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
  } = useAuth();
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  function avisar(tipo: Aviso["tipo"], texto: string) {
    setAviso({ tipo, texto });
    setTimeout(() => setAviso(null), 6000);
  }

  async function guardar(
    datos: DatosFormularioUsuario,
    id?: number,
  ): Promise<string | null> {
    const error = id
      ? await actualizarUsuario(
          id,
          { nombre: datos.nombre, rol: datos.rol, activo: datos.activo },
          datos.clave || undefined,
        )
      : await crearUsuario({
          nombre: datos.nombre,
          usuario: datos.usuario,
          rol: datos.rol,
          clave: datos.clave,
        });

    if (error) return error;
    setEditando(null);
    avisar(
      "success",
      id
        ? `Usuario "${datos.nombre}" actualizado.`
        : `Usuario "${datos.nombre}" creado.`,
    );
    return null;
  }

  function eliminar(u: Usuario) {
    if (
      !window.confirm(
        `¿Eliminar al usuario "${u.nombre}"? Esta acción no se puede deshacer.`,
      )
    )
      return;
    const error = eliminarUsuario(u.id);
    if (error) return avisar("danger", error);
    if (editando?.id === u.id) setEditando(null);
    avisar("success", `Usuario "${u.nombre}" eliminado.`);
  }

  function editar(u: Usuario) {
    setEditando(u);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const administradores = usuarios.filter(
    (u) => u.rol === "Administrador",
  ).length;
  const vendedores = usuarios.filter((u) => u.rol === "Vendedor").length;

  return (
    <div>
      <div className="mb-4">
        <h1 className="mb-1">Usuarios</h1>
        <p className="text-secondary mb-0">
          {usuarios.length} {usuarios.length === 1 ? "usuario" : "usuarios"} ·{" "}
          {administradores}{" "}
          {administradores === 1 ? "administrador" : "administradores"} ·{" "}
          {vendedores} {vendedores === 1 ? "vendedor" : "vendedores"}
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

      <div className="row g-4">
        <div className="col-lg-4">
          <FormularioUsuario
            key={editando?.id ?? "nuevo"}
            editando={editando}
            onGuardar={guardar}
            onCancelar={() => setEditando(null)}
          />
        </div>
        <div className="col-lg-8">
          <TablaUsuarios
            usuarios={usuarios}
            actualId={usuario?.id}
            onEditar={editar}
            onEliminar={eliminar}
          />
        </div>
      </div>
    </div>
  );
}
