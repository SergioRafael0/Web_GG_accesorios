import { http } from "./http";

export function getProductos() {
  return http.get("/api/v1/productos");
}

export function getProductoById(id) {
  return http.get(`/api/v1/productos/${id}`).then((data) => {
    if (!data) return null;
    const imagen = data.imagen || data.imagenUrl || "";
    return { ...data, imagen };
  });
}

export function createProducto(payload) {
  return http.post("/api/v1/productos", payload);
}

export function updateProducto(id, payload) {
  return http.put(`/api/v1/productos/${id}`, payload);
}

export function deleteProducto(id) {
  return http.del(`/api/v1/productos/${id}`);
}

