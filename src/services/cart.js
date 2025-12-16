import { http } from "./http";

export async function getCart() {
  return http.get("/api/v1/cart");
}

export async function addItem(productoId, cantidad = 1) {
  return http.post("/api/v1/cart/items", { productoId, cantidad });
}

export async function updateItem(productoId, cantidad) {
  return http.put(`/api/v1/cart/items/${productoId}`, { cantidad });
}

export async function removeItem(productoId) {
  return http.del(`/api/v1/cart/items/${productoId}`);
}

