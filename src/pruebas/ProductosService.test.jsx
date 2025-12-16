import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProductos, getProductoById, createProducto, updateProducto, deleteProducto } from "../services/productos";
import { http } from "../services/http";

vi.mock("../services/http", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    del: vi.fn(),
  },
}));

describe("Servicio de Productos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Caso 6: Obtener productos debe consultar el listado general", async () => {
    await getProductos();
    expect(http.get).toHaveBeenCalledWith("/api/v1/productos");
  });

  it("Caso 7: Obtener producto por ID debe normalizar la URL de la imagen si viene como 'imagenUrl'", async () => {
    const datosProducto = { id: 1, nombre: "Producto 1", imagenUrl: "http://sitio.com/img.jpg" };
    http.get.mockResolvedValue(datosProducto);

    const resultado = await getProductoById(1);

    expect(http.get).toHaveBeenCalledWith("/api/v1/productos/1");
    expect(resultado.imagen).toBe("http://sitio.com/img.jpg");
  });

  it("Caso 8: Obtener producto por ID debe retornar null si el producto no existe en la API", async () => {
    http.get.mockResolvedValue(null);
    const resultado = await getProductoById(999);
    expect(resultado).toBeNull();
  });

  it("Caso 9: Crear producto debe enviar los datos mediante POST", async () => {
    const nuevoProducto = { nombre: "Producto Nuevo" };
    await createProducto(nuevoProducto);
    expect(http.post).toHaveBeenCalledWith("/api/v1/productos", nuevoProducto);
  });

  it("Caso 10: Actualizar producto debe usar PUT con el ID específico", async () => {
    const datosActualizar = { precio: 500 };
    await updateProducto(10, datosActualizar);
    expect(http.put).toHaveBeenCalledWith("/api/v1/productos/10", datosActualizar);
  });

  it("Caso 11: Eliminar producto debe usar DELETE con el ID específico", async () => {
    await deleteProducto(5);
    expect(http.del).toHaveBeenCalledWith("/api/v1/productos/5");
  });
});
