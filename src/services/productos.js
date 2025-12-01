import { http } from "./http";

export function getProductos() {
  return http.get("/productos");
}

export function getProductoById(id) {
  return http.get(`/productos/${id}`).then((data) => {
    if (!data) return null;
    const imagen = data.imagen || data.imagenUrl || "";
    return { ...data, imagen };
  });
}

