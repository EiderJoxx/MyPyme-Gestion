import { useState } from "react";
import type { DatosFormularioUsuario, Rol, Usuario } from "../../types";
import { DESCRIPCION_ROL, ROLES } from "../../auth/permisos";

interface Props {
  editando: Usuario | null;
  onGuardar: (
    datos: DatosFormularioUsuario,
    id?: number,
  ) => Promise<string | null>;
  onCancelar: () => void;
}

export default function FormularioUsuario({
  editando,
  onGuardar,
  onCancelar,
}: Props) {
  const [nombre, setNombre] = useState(editando?.nombre ?? "");
  const [usuario, setUsuario] = useState(editando?.usuario ?? "");
  const [rol, setRol] = useState<Rol>(editando?.rol ?? "Vendedor");
  const [activo, setActivo] = useState(editando?.activo ?? true);
  const [clave, setClave] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (clave !== confirmar) return setError("Las contraseñas no coinciden");
    if (!editando && !clave)
      return setError("Escribe una contraseña para el nuevo usuario");

    setEnviando(true);
    const mensaje = await onGuardar(
      { nombre, usuario, rol, activo, clave },
      editando?.id,
    );
    setEnviando(false);
    if (mensaje) return setError(mensaje);

    if (!editando) {
      setNombre("");
      setUsuario("");
      setRol("Vendedor");
      setClave("");
      setConfirmar("");
    }
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">
          {editando ? `Editar a ${editando.nombre}` : "Nuevo usuario"}
        </h2>

        {error && (
          <div className="alert alert-danger py-2 mb-0" role="alert">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="usu-nombre" className="form-label">
            Nombre completo
          </label>
          <input
            id="usu-nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="usu-usuario" className="form-label">
            Usuario para ingresar
          </label>
          <input
            id="usu-usuario"
            className="form-control"
            value={usuario}
            disabled={!!editando}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ej: maria"
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="usu-rol" className="form-label">
            Rol
          </label>
          <select
            id="usu-rol"
            className="form-select"
            value={rol}
            onChange={(e) => setRol(e.target.value as Rol)}
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <small className="text-secondary">{DESCRIPCION_ROL[rol]}</small>
        </div>

        <div>
          <label htmlFor="usu-clave" className="form-label">
            {editando ? "Nueva contraseña (vacío = no cambiar)" : "Contraseña"}
          </label>
          <input
            id="usu-clave"
            type="password"
            className="form-control"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="usu-confirmar" className="form-label">
            Confirmar contraseña
          </label>
          <input
            id="usu-confirmar"
            type="password"
            className="form-control"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            autoComplete="new-password"
          />
          <small className="text-secondary">Mínimo 8 caracteres.</small>
        </div>

        {editando && (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="usu-activo"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="usu-activo">
              Cuenta activa
            </label>
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary flex-grow-1"
            disabled={enviando}
          >
            {enviando
              ? "Guardando..."
              : editando
                ? "Guardar cambios"
                : "Crear usuario"}
          </button>
          {editando && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancelar}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
