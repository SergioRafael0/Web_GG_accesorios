import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkoutCreate, checkoutConfirm, getOrderById } from "../services/orders";
import { http } from "../services/http";

vi.mock("../services/http", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("Servicio de Órdenes (Modo Sin Conexión)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Caso 16: Crear orden (Online) debe usar la API si hay red", async () => {
    const datosOrden = { total: 1000 };
    http.post.mockResolvedValue({ id: "id-servidor", ...datosOrden });

    const resultado = await checkoutCreate(datosOrden);
    expect(http.post).toHaveBeenCalledWith("/api/v1/checkout", datosOrden);
    expect(resultado.id).toBe("id-servidor");
  });

  it("Caso 17: Crear orden (Offline) debe guardar en localStorage si falla la red", async () => {
    const datosOrden = { total: 5000, items: [] };
    const errorRed = new Error("Error de Red");
    errorRed.code = "NETWORK_ERROR";
    http.post.mockRejectedValue(errorRed);

    const resultado = await checkoutCreate(datosOrden);

    expect(resultado._fallback).toBe(true);
    expect(resultado.total).toBe(5000);
    
    const ordenesGuardadas = JSON.parse(localStorage.getItem("orders"));
    expect(ordenesGuardadas).toHaveLength(1);
    expect(ordenesGuardadas[0].total).toBe(5000);
  });

  it("Caso 18: Confirmar pago (Online) debe notificar a la API", async () => {
    http.post.mockResolvedValue({ status: "PAID" });
    await checkoutConfirm("orden-1", "ref-123");
    expect(http.post).toHaveBeenCalledWith("/api/v1/checkout/orden-1/confirm", { referenciaPago: "ref-123" });
  });

  it("Caso 19: Confirmar pago (Offline) debe actualizar el estado localmente", async () => {
    // Configurar estado previo: una orden pendiente guardada localmente
    const ordenLocal = { id: "local-1", status: "PENDING", total: 100 };
    localStorage.setItem("orders", JSON.stringify([ordenLocal]));

    // Simular fallo de red
    http.post.mockRejectedValue(new Error("Sin conexión"));

    const resultado = await checkoutConfirm("local-1", "ref-pago");

    expect(resultado._fallback).toBe(true);
    expect(resultado.estado).toBe("PAID"); 

    // Verificar que se actualizó en localStorage
    const ordenesGuardadas = JSON.parse(localStorage.getItem("orders"));
    expect(ordenesGuardadas[0].status).toBe("PAID");
  });

  it("Caso 20: Obtener orden por ID (Offline) debe buscar en localStorage si la API falla", async () => {
    const ordenLocal = { id: "local-99", total: 999 };
    localStorage.setItem("orders", JSON.stringify([ordenLocal]));

    http.get.mockRejectedValue(new Error("Sin conexión"));

    const resultado = await getOrderById("local-99");

    expect(resultado).not.toBeNull();
    expect(resultado.id).toBe("local-99");
    expect(resultado._fallback).toBe(true);
  });

  it("Caso 21: Obtener orden inexistente (Offline) debe retornar null correctamente", async () => {
    http.get.mockRejectedValue(new Error("Sin conexión"));
    const resultado = await getOrderById("no-existe");
    expect(resultado).toBeNull();
  });
});
