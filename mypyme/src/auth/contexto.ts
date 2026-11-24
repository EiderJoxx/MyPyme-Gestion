import { createContext } from "react";
import type { DatosFormularioUsuario, Rol, Usuario } from "../types";

export interface UsuarioSesion {
  id: number;
  nombre: string;
  nombreUsuario: string;
  rol: Rol;
  expira: string;
}

export type DatosUsuario = Pick<
  DatosFormularioUsuario,
  "nombre" | "nombreUsuario" | "rol" | "clave"
>;

export type ResultadoLogin =
  | { ok: true; usuario: UsuarioSesion }
  | { ok: false; error: string };

export interface AuthContextValue {
  usuario: UsuarioSesion | null;
  usuarios: Usuario[];
  necesitaConfiguracion: boolean | null;
  iniciarSesion: (nombreUsuario: string, clave: string) => Promise<ResultadoLogin>;
  configurarAdministrador: (
    datos: Omit<DatosUsuario, "rol">,
  ) => Promise<ResultadoLogin>;
  cerrarSesion: () => void;
  recargarUsuarios: () => Promise<void>;
  crearUsuario: (datos: DatosUsuario) => Promise<string | null>;
  actualizarUsuario: (
    id: number,
    cambios: { nombre: string; rol: Rol; activo: boolean },
    nuevaClave?: string,
  ) => Promise<string | null>;
  eliminarUsuario: (id: number) => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);