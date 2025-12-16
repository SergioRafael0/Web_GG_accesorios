import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCart, addItem, updateItem, removeItem } from "../services/cart";
import { http } from "../services/http";

vi.mock("../services/http", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    del: vi.fn(),
  },
}));

describe("Servicio de Carrito", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Caso 12: Obtener carrito debe consultar el endpoint del carrito", async () => {
    await getCart();
    expect(http.get).toHaveBeenCalledWith("/api/v1/cart");
  });

  it("Caso 13: Agregar ítem debe enviar ID de producto y cantidad", async () => {
    await addItem(100, 2);
    expect(http.post).toHaveBeenCalledWith("/api/v1/cart/items", { productoId: 100, cantidad: 2 });
  });

  it("Caso 14: Actualizar ítem debe enviar la nueva cantidad", async () => {
    await updateItem(100, 5);
    expect(http.put).toHaveBeenCalledWith("/api/v1/cart/items/100", { cantidad: 5 });
  });

  it("Caso 15: Eliminar ítem debe borrar el producto específico del carrito", async () => {
    await removeItem(200);
    expect(http.del).toHaveBeenCalledWith("/api/v1/cart/items/200");
  });
});
