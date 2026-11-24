import { api, setToken, clearToken } from "../utils/api";
import type { LoginRequest, LoginRespuesta } from "../types";

export const authService = {
  async login(datos: LoginRequest): Promise<LoginRespuesta> {
    const r = await api<LoginRespuesta>("/Auth/login", {
      method: "POST",
      body: JSON.stringify(datos),
    });
    setToken(r.token);
    return r;
  },
  logout: () => clearToken(),
};