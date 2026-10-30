import type { ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Rol, Usuario } from "../types";
import { generarSalt, hashClave } from "../utils/seguridad";
import {
  AuthContext,
  type DatosUsuario,
  type ResultadoLogin,
} from "./contexto";

const limpiar = (texto: string) => texto.trim().toLowerCase();

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useLocalStorage<Usuario[]>(
    "mypyme_usuarios",
    [],
  );
  const [sesionId, setSesionId] = useLocalStorage<number | null>(
    "mypyme_sesion",
    null,
  );

  const usuario = usuarios.find((u) => u.id === sesionId && u.activo) ?? null;
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
        (u) => u.id !== idActual && u.usuario === limpiar(nombreUsuario),
      )
    ) {
      return "Ese nombre de usuario ya existe";
    }
    if ((claveObligatoria || clave) && clave.length < 8)
      return "La contraseña debe tener al menos 8 caracteres";
    return null;
  }

  async function construir(datos: DatosUsuario): Promise<Usuario> {
    const salt = generarSalt();
    return {
      id: Date.now(),
      nombre: datos.nombre.trim(),
      usuario: limpiar(datos.usuario),
      rol: datos.rol,
      activo: true,
      salt,
      hash: await hashClave(datos.clave, salt),
      creado: new Date().toISOString(),
    };
  }

  async function iniciarSesion(
    nombreUsuario: string,
    clave: string,
  ): Promise<ResultadoLogin> {
    // Mismo mensaje para usuario o contraseña incorrectos, para no dar pistas
    const generico = {
      ok: false as const,
      error: "Usuario o contraseña incorrectos",
    };
    const encontrado = usuarios.find(
      (u) => u.usuario === limpiar(nombreUsuario),
    );
    if (!encontrado) return generico;
    if ((await hashClave(clave, encontrado.salt)) !== encontrado.hash)
      return generico;
    if (!encontrado.activo)
      return {
        ok: false,
        error: "Esta cuenta está desactivada. Habla con el administrador.",
      };
    setSesionId(encontrado.id);
    return { ok: true, usuario: encontrado };
  }

  // Solo funciona cuando todavía no existe ningún usuario
  async function configurarAdministrador(
    datos: Omit<DatosUsuario, "rol">,
  ): Promise<ResultadoLogin> {
    if (usuarios.length > 0)
      return {
        ok: false,
        error: "El sistema ya tiene usuarios. Inicia sesión.",
      };
    const error = validar(datos.nombre, datos.usuario, datos.clave, true);
    if (error) return { ok: false, error };
    const nuevo = await construir({ ...datos, rol: "Administrador" });
    setUsuarios([nuevo]);
    setSesionId(nuevo.id);
    return { ok: true, usuario: nuevo };
  }

  function cerrarSesion() {
    setSesionId(null);
  }

  async function crearUsuario(datos: DatosUsuario): Promise<string | null> {
    const error = validar(datos.nombre, datos.usuario, datos.clave, true);
    if (error) return error;
    const nuevo = await construir(datos);
    setUsuarios((prev) => [...prev, nuevo]);
    return null;
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
      objetivo.usuario,
      nuevaClave ?? "",
      false,
      id,
    );
    if (error) return error;
    if (usuario?.id === id && !cambios.activo)
      return "No puedes desactivar tu propia cuenta";

    const dejaDeSerAdmin =
      objetivo.rol === "Administrador" &&
      objetivo.activo &&
      (cambios.rol !== "Administrador" || !cambios.activo);
    if (dejaDeSerAdmin && administradoresActivos() <= 1)
      return "Debe quedar al menos un administrador activo";

    let { salt, hash } = objetivo;
    if (nuevaClave) {
      salt = generarSalt();
      hash = await hashClave(nuevaClave, salt);
    }
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, ...cambios, nombre: cambios.nombre.trim(), salt, hash }
          : u,
      ),
    );
    return null;
  }

  function eliminarUsuario(id: number): string | null {
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
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        usuarios,
        iniciarSesion,
        configurarAdministrador,
        cerrarSesion,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
