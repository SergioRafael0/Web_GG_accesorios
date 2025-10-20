import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "../pages/Cart.jsx"; // Ajusta según tu ruta real
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { act } from "react-dom/test-utils";

const productos = [
  { id: 1, nombre: "Silla Gamer Pro", precio: 150000, quantity: 2 },
  { id: 2, nombre: "Auriculares RGB", precio: 49990, quantity: 1 },
];

describe("Cart", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("cart", JSON.stringify(productos));
  });

  it("renderiza los productos y calcula el total correctamente", () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    // ✅ Productos visibles
    expect(screen.getByText("Silla Gamer Pro")).toBeTruthy();
    expect(screen.getByText("Auriculares RGB")).toBeTruthy();

    // ✅ Subtotales correctos (usa getAllByText)
    const subtotales = screen.getAllByText(/\$/); // capturamos todos los que contienen $
    const subtotalSilla = subtotales.find(el => el.textContent.includes("300.000"));
    const subtotalAuriculares = subtotales.find(el => el.textContent.includes("49.990"));
    expect(subtotalSilla).toBeTruthy();
    expect(subtotalAuriculares).toBeTruthy();

    // ✅ Total correcto
    const total = screen.getByText(/Total: \$349.990/);
    expect(total).toBeTruthy();
  });

  it("elimina un producto correctamente", () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    // Eliminar el primer producto con act
    const btnEliminar = screen.getAllByText("Eliminar")[0];
    act(() => {
      fireEvent.click(btnEliminar);
    });

    // Ahora la Silla Gamer Pro ya no debe estar
    expect(screen.queryByText("Silla Gamer Pro")).toBeNull();

    // Total actualizado
    const total = screen.getByText(/Total: \$49.990/);
    expect(total).toBeTruthy();
  });
});
