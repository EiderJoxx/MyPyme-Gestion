import { useState } from "react";
import type { DatosFormularioUsuario, Rol, Usuario } from "../../types";
import { DESCRIPCION_ROL, ROLES } from "../../auth/permisos";
import { useAuth } from "../../auth/useAuth";

interface Props {
  editando: Usuario | null;
  onGuardar: (datos: DatosFormularioUsuario, id?: number) => Promise<string | null>;
  onCancelar: () => void;
}

export default function FormularioUsuario({ editando, onGuardar, onCancelar }: Props) {
  const { usuario: usuarioActual } = useAuth(); 
  
  const [nombre, setNombre] = useState(editando?.nombre ?? "");
  const [nombreUsuario, setNombreUsuario] = useState(editando?.nombreUsuario ?? "");
  const [rol, setRol] = useState<Rol>(editando?.rol ?? "Vendedor");
  const [activo, setActivo] = useState(editando?.activo ?? true);
  const [clave, setClave] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [llaveSeguridad, setLlaveSeguridad] = useState(""); 
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const rolesDisponibles = ROLES.filter((r) => {
    if (usuarioActual?.rol === "SuperAdmin") return true;
    return r === "Vendedor"; 
  });

  async function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (clave !== confirmar) return setError("Las contraseñas no coinciden");
    if (!editando && !clave) return setError("Escribe una contraseña para el nuevo usuario");
    
    if ((rol === "Administrador" || rol === "SuperAdmin") && !llaveSeguridad) {
      return setError("La llave de seguridad es obligatoria.");
    }

    setEnviando(true);
    const mensaje = await onGuardar(
      { nombre, nombreUsuario, rol, activo, clave, llaveSeguridad },
      editando?.id,
    );
    setEnviando(false);
    if (mensaje) return setError(mensaje);

    if (!editando) {
      setNombre("");
      setNombreUsuario("");
      setRol("Vendedor");
      setClave("");
      setConfirmar("");
      setLlaveSeguridad(""); 
    }
  }

  return (
    <form onSubmit={alEnviar} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h2 className="h5 mb-0">
          {editando ? `Editar a ${editando.nombre}` : "Nuevo usuario"}
        </h2>

        {error && <div className="alert alert-danger py-2 mb-0" role="alert">{error}</div>}

        <div>
          <label htmlFor="usu-nombre" className="form-label">Nombre completo</label>
          <input
            id="usu-nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="usu-usuario" className="form-label">Usuario para ingresar</label>
          <input
            id="usu-usuario"
            className="form-control"
            value={nombreUsuario}
            disabled={!!editando}
            onChange={(e) => setNombreUsuario(e.target.value)}
            placeholder="Ej: maria"
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="usu-rol" className="form-label">Rol</label>
          <select
            id="usu-rol"
            className="form-select"
            value={rol}
            onChange={(e) => setRol(e.target.value as Rol)}
            disabled={rolesDisponibles.length === 1} 
          >
            {rolesDisponibles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <small className="text-secondary">{DESCRIPCION_ROL[rol]}</small>
        </div>

        {(rol === "Administrador" || rol === "SuperAdmin") && usuarioActual?.rol === "SuperAdmin" && (
          <div className="p-3 bg-light border border-warning rounded shadow-sm">
            <label htmlFor="usu-llave" className="form-label text-danger fw-bold">
              Llave de Seguridad (SuperAdmin)
            </label>
            <input
              id="usu-llave"
              type="password"
              className="form-control"
              value={llaveSeguridad}
              onChange={(e) => setLlaveSeguridad(e.target.value)}
              placeholder="Ingresa el código secreto"
            />
          </div>
        )}

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
          />
        </div>

        <div>
          <label htmlFor="usu-confirmar" className="form-label">Confirmar contraseña</label>
          <input
            id="usu-confirmar"
            type="password"
            className="form-control"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />
        </div>

        {editando && (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="usu-activo"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="usu-activo">Cuenta activa</label>
          </div>
        )}

        <div className="d-flex gap-2 mt-2">
          <button type="submit" className="btn btn-primary flex-grow-1" disabled={enviando}>
            {enviando ? "Guardando..." : editando ? "Guardar cambios" : "Crear usuario"}
          </button>
          {editando && (
            <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}