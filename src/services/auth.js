import { http } from "./http";

export async function login(email, password) {
  const result = await http.post("/api/v1/auth/login", { email, password });
  const token = result?.token;
  const user = result?.user;
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("usuarioActivo", JSON.stringify(user));
  try { window.dispatchEvent(new Event("userUpdated")); } catch (e) { void e; }
  return { token, user };
}

export async function register(payload) {
  return http.post("/api/v1/auth/register", payload);
}

export async function me() {
  return http.get("/api/v1/users/me");
}

export async function datosCompra() {
  return http.get("/api/v1/users/me/datos-compra");
}

export async function updateMe(profilePartial) {
  return http.patch("/api/v1/users/me", profilePartial);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioActivo");
  try { window.dispatchEvent(new Event("userUpdated")); } catch (e) { void e; }
}

