const aHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const generarSalt = () =>
  aHex(crypto.getRandomValues(new Uint8Array(16)));

// Cifra la contraseña con SHA-256
export async function hashClave(clave: string, salt: string) {
  const datos = new TextEncoder().encode(salt + clave);
  const resumen = await crypto.subtle.digest("SHA-256", datos);
  return aHex(new Uint8Array(resumen));
}
