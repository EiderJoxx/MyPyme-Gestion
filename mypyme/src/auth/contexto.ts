import { createContext } from "react";
import type { Rol, Usuario } from "../types";

export interface DatosUsuario {
  nombre: string;
  usuario: string;
  rol: Rol;
  clave: string;
}

export type ResultadoLogin =
  | { ok: true; usuario: Usuario }
  | { ok: false; error: string };

export interface AuthValor {
  usuario: Usuario | null;
  usuarios: Usuario[];
  iniciarSesion: (usuario: string, clave: string) => Promise<ResultadoLogin>;
  configurarAdministrador: (
    datos: Omit<DatosUsuario, "rol">,
  ) => Promise<ResultadoLogin>;
  cerrarSesion: () => void;
  crearUsuario: (datos: DatosUsuario) => Promise<string | null>;
  actualizarUsuario: (
    id: number,
    cambios: { nombre: string; rol: Rol; activo: boolean },
    nuevaClave?: string,
  ) => Promise<string | null>;
  eliminarUsuario: (id: number) => string | null;
}

export const AuthContext = createContext<AuthValor | null>(null);
