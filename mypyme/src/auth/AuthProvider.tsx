import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { LoginRespuesta, Rol, Usuario, UsuarioUpdate } from "../types";
import { authService } from "../services/authService";
import { api, clearToken, getToken, SESION_KEY } from "../utils/api";
import {
  AuthContext,
  type DatosUsuario,
  type ResultadoLogin,
  type UsuarioSesion,
} from "./contexto";

const limpiar = (texto: string) => texto.trim().toLowerCase();
const mensajeError = (e: unknown) =>
  e instanceof Error ? e.message : "Ocurrió un error inesperado";

function leerSesion(): UsuarioSesion | null {
  try {
    const crudo = localStorage.getItem(SESION_KEY);
    if (!crudo || !getToken()) return null;
    const s = JSON.parse(crudo) as UsuarioSesion;
    // Formato viejo (solo un número) o sesión vencida: se descarta
    if (!s?.id || new Date(s.expira).getTime() <= Date.now()) {
      clearToken();
      return null;
    }
    return s;
  } catch {
    clearToken();
    return null;
  }
}

function guardarSesionLocal(s: UsuarioSesion) {
  localStorage.setItem(SESION_KEY, JSON.stringify(s));
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(leerSesion);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [necesitaConfiguracion, setNecesitaConfiguracion] = useState<
    boolean | null
  >(null);

  const esAdmin = usuario?.rol === "Administrador";

  const cerrarSesion = useCallback(() => {
    authService.logout();
    setUsuario(null);
    setUsuarios([]);
  }, []);

  const recargarUsuarios = useCallback(async () => {
    try {
      setUsuarios(await api<Usuario[]>("/Usuarios"));
    } catch {
      // Si falla, se conserva la lista actual
    }
  }, []);

  // Cierra la sesión sola cuando vence el token
  useEffect(() => {
    if (!usuario) return;
    const ms = new Date(usuario.expira).getTime() - Date.now();
    const t = setTimeout(cerrarSesion, Math.min(Math.max(ms, 0), 2_000_000_000));
    return () => clearTimeout(t);
  }, [usuario, cerrarSesion]);

  // Mantiene sincronizadas varias pestañas (cerrar sesión en una cierra en todas)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SESION_KEY || e.key === "token" || e.key === null) {
        setUsuario(leerSesion());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ¿Hay que crear el primer administrador?
  useEffect(() => {
    if (usuario) return;
    let activo = true;
    api<{ configurado: boolean }>("/Auth/configurado")
      .then((r) => activo && setNecesitaConfiguracion(!r.configurado))
      .catch(() => activo && setNecesitaConfiguracion(null));
    return () => {
      activo = false;
    };
  }, [usuario]);

  // Solo el administrador puede listar usuarios
  useEffect(() => {
    if (esAdmin) void recargarUsuarios();
  }, [esAdmin, recargarUsuarios]);

  const administradoresActivos = () =>
    usuarios.filter((u) => u.rol === "Administrador" && u.activo).length;

  function validar(
    nombre: string,
    nombreUsuario: string,
    clave: string,
    claveObligatoria: boolean,
    idActual?: number,
  ) {
    if (!nombre.trim()) return "Escribe el nombre completo";
    if (!/^[a-z0-9._-]{3,20}$/.test(limpiar(nombreUsuario))) {
      return "El usuario debe tener entre 3 y 20 caracteres: letras, números, punto, guion o guion bajo";
    }
    if (
      usuarios.some(
        (u) =>
          u.id !== idActual && limpiar(u.nombreUsuario) === limpiar(nombreUsuario),
      )
    ) {
      return "Ese nombre de usuario ya existe";
    }
    if ((claveObligatoria || clave) && clave.length < 8)
      return "La contraseña debe tener al menos 8 caracteres";
    return null;
  }

  function abrirSesion(r: LoginRespuesta, nombreUsuario: string): UsuarioSesion {
    const s: UsuarioSesion = {
      id: r.id,
      nombre: r.nombre,
      nombreUsuario,
      rol: r.rol,
      expira: r.expira,
    };
    guardarSesionLocal(s);
    setUsuario(s);
    return s;
  }

  async function iniciarSesion(
    nombreUsuario: string,
    clave: string,
  ): Promise<ResultadoLogin> {
    if (!nombreUsuario.trim() || !clave)
      return { ok: false, error: "Escribe tu usuario y contraseña" };
    const nombre = limpiar(nombreUsuario);
    try {
      const r = await authService.login({ nombreUsuario: nombre, clave });
      return { ok: true, usuario: abrirSesion(r, nombre) };
    } catch (e) {
      return { ok: false, error: mensajeError(e) };
    }
  }

  // Solo funciona cuando todavía no existe ningún usuario (la API lo exige)
  async function configurarAdministrador(
    datos: Omit<DatosUsuario, "rol">,
  ): Promise<ResultadoLogin> {
    const error = validar(datos.nombre, datos.nombreUsuario, datos.clave, true);
    if (error) return { ok: false, error };
    try {
      await api("/Auth/registro", {
        method: "POST",
        body: JSON.stringify({
          nombre: datos.nombre.trim(),
          nombreUsuario: limpiar(datos.nombreUsuario),
          clave: datos.clave,
          rol: "Administrador",
        }),
      });
      setNecesitaConfiguracion(false);
      return await iniciarSesion(datos.nombreUsuario, datos.clave);
    } catch (e) {
      return { ok: false, error: mensajeError(e) };
    }
  }

  async function crearUsuario(datos: DatosUsuario): Promise<string | null> {
    const error = validar(datos.nombre, datos.nombreUsuario, datos.clave, true);
    if (error) return error;
    try {
      await api("/Usuarios", {
        method: "POST",
        body: JSON.stringify({
          nombre: datos.nombre.trim(),
          nombreUsuario: limpiar(datos.nombreUsuario),
          clave: datos.clave,
          rol: datos.rol,
        }),
      });
      await recargarUsuarios();
      return null;
    } catch (e) {
      return mensajeError(e);
    }
  }

  async function actualizarUsuario(
    id: number,
    cambios: { nombre: string; rol: Rol; activo: boolean },
    nuevaClave?: string,
  ): Promise<string | null> {
    const objetivo = usuarios.find((u) => u.id === id);
    if (!objetivo) return "El usuario ya no existe";

    const error = validar(
      cambios.nombre,
      objetivo.nombreUsuario,
      nuevaClave ?? "",
      false,
      id,
    );
    if (error) return error;
    if (usuario?.id === id && !cambios.activo)
      return "No puedes desactivar tu propia cuenta";
    // El rol va dentro del token: cambiarlo en tu propia sesión la dejaría desfasada
    if (usuario?.id === id && cambios.rol !== usuario.rol)
      return "No puedes cambiar tu propio rol";

    const dejaDeSerAdmin =
      objetivo.rol === "Administrador" &&
      objetivo.activo &&
      (cambios.rol !== "Administrador" || !cambios.activo);
    if (dejaDeSerAdmin && administradoresActivos() <= 1)
      return "Debe quedar al menos un administrador activo";

    const body: UsuarioUpdate = {
      nombre: cambios.nombre.trim(),
      rol: cambios.rol,
      activo: cambios.activo,
      nuevaClave: nuevaClave ? nuevaClave : null,
    };

    try {
      await api<unknown>(`/Usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      if (usuario && usuario.id === id) {
        const s = { ...usuario, nombre: body.nombre };
        guardarSesionLocal(s);
        setUsuario(s);
      }
      await recargarUsuarios();
      return null;
    } catch (e) {
      return mensajeError(e);
    }
  }

  async function eliminarUsuario(id: number): Promise<string | null> {
    const objetivo = usuarios.find((u) => u.id === id);
    if (!objetivo) return null;
    if (usuario?.id === id) return "No puedes eliminar tu propia cuenta";
    if (
      objetivo.rol === "Administrador" &&
      objetivo.activo &&
      administradoresActivos() <= 1
    ) {
      return "Debe quedar al menos un administrador activo";
    }
    try {
      await api<void>(`/Usuarios/${id}`, { method: "DELETE" });
      await recargarUsuarios();
      return null;
    } catch (e) {
      return mensajeError(e);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        usuarios,
        necesitaConfiguracion,
        iniciarSesion,
        configurarAdministrador,
        cerrarSesion,
        recargarUsuarios,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}