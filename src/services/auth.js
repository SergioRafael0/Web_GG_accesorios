import { http } from "./http";

export async function login(email, password) {
  const result = await http.post("/auth/login", { email, password });
  const token = result?.token;
  const user = result?.user;
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("usuarioActivo", JSON.stringify(user));
  return { token, user };
}

export async function register(payload) {
  return http.post("/auth/register", payload);
}

export async function me() {
  return http.get("/users/me");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioActivo");
}

