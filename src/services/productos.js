import { http } from "./http";

export function getProductos() {
  return http.get("/productos");
}

export function getProductoById(id) {
  return http.get(`/productos/${id}`);
}

