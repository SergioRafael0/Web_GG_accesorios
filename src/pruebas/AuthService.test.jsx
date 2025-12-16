import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, register, logout, me, updateMe } from "../services/auth";
import { http } from "../services/http";

vi.mock("../services/http", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("Servicio de Autenticación", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Caso 1: Iniciar sesión debe llamar a la API y guardar las credenciales localmente", async () => {
    const respuestaSimulada = { token: "abc-123", user: { id: 1, name: "Usuario Prueba" } };
    http.post.mockResolvedValue(respuestaSimulada);

    const resultado = await login("test@correo.com", "123456");

    expect(http.post).toHaveBeenCalledWith("/api/v1/auth/login", { email: "test@correo.com", password: "123456" });
    expect(localStorage.getItem("token")).toBe("abc-123");
    expect(localStorage.getItem("usuarioActivo")).toContain("Usuario Prueba");
    expect(resultado).toEqual(respuestaSimulada);
  });

  it("Caso 2: Registrar usuario debe enviar los datos correctos a la API", async () => {
    const datosRegistro = { email: "nuevo@correo.com", password: "clave" };
    http.post.mockResolvedValue({ id: 2, ...datosRegistro });

    await register(datosRegistro);

    expect(http.post).toHaveBeenCalledWith("/api/v1/auth/register", datosRegistro);
  });

  it("Caso 3: Cerrar sesión debe eliminar el token y usuario del almacenamiento local", () => {
    localStorage.setItem("token", "token-falso");
    localStorage.setItem("usuarioActivo", "{ datos: 'viejos' }");

    logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("usuarioActivo")).toBeNull();
  });

  it("Caso 4: Obtener perfil (me) debe consultar el endpoint de usuario actual", async () => {
    await me();
    expect(http.get).toHaveBeenCalledWith("/api/v1/users/me");
  });

  it("Caso 5: Actualizar perfil debe enviar solo los datos modificados (PATCH)", async () => {
    const datosParciales = { nombre: "Nuevo Nombre" };
    await updateMe(datosParciales);
    expect(http.patch).toHaveBeenCalledWith("/api/v1/users/me", datosParciales);
  });
});
