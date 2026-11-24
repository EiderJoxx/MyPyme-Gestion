const API_URL = import.meta.env.VITE_API_URL as string;
const TOKEN_KEY = "token";
export const SESION_KEY = "mypyme_sesion";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
// Borra token Y sesión, para que al recargar /login no te devuelva al panel
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESION_KEY);
};

async function leerError(res: Response): Promise<string> {
  const texto = await res.text().catch(() => "");
  if (texto) {
    try {
      const d = JSON.parse(texto);
      if (typeof d === "string") return d;
      if (d?.mensaje) return d.mensaje;
      if (d?.errors)
        return Object.values(d.errors as Record<string, string[]>).flat().join(" ");
      if (d?.title) return d.title;
    } catch {
      return texto.slice(0, 200);
    }
  }
  if (res.status === 403) return "No tienes permiso para realizar esta acción.";
  if (res.status === 401) return "Sesión o credenciales inválidas.";
  if (res.status === 404) return "No se encontró el recurso solicitado.";
  if (res.status === 429) return "Demasiados intentos. Intenta de nuevo más tarde.";
  return `Error ${res.status}`;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que la API esté encendida.",
    );
  }

  if (res.status === 401 && !path.startsWith("/Auth/")) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }
  if (!res.ok) throw new Error(await leerError(res));
  if (res.status === 204) return undefined as T;

  const texto = await res.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
}

export function qs(params: Record<string, string | number | undefined | null>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const mensajeError = (e: unknown) =>
  e instanceof Error ? e.message : "Ocurrió un error inesperado";

// Ejecuta una acción y devuelve null si salió bien, o el mensaje de error
export async function intentar(
  accion: () => Promise<void>,
): Promise<string | null> {
  try {
    await accion();
    return null;
  } catch (e) {
    return mensajeError(e);
  }
}
