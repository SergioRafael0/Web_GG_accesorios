import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

describe("ProductCard", () => {
  const producto = {
    id: 1,
    nombre: "Silla Gamer Pro",
    precio: 150000,
    imagen: "/images/silla-gamer-pro.jpg",
    descripcion: "Silla ergonómica con soporte lumbar ajustable y diseño gamer."
  };

  // Limpiar localStorage antes de cada test
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renderiza correctamente los datos del producto y permite añadir al carrito", () => {
    render(
      <MemoryRouter>
        <ProductCard {...producto} />
      </MemoryRouter>
    );

    // 1️⃣ Nombre visible
    expect(screen.getByText("Silla Gamer Pro")).toBeTruthy();

    // 2️⃣ Descripción visible
    expect(screen.getByText(/Silla ergonómica/i)).toBeTruthy();

    // 3️⃣ Precio visible
    expect(screen.getByText("$150.000")).toBeTruthy();

    // 4️⃣ Botón añadir al carrito funciona y actualiza localStorage
    const addButton = screen.getByRole("button", { name: /añadir al carrito/i });
    fireEvent.click(addButton);

    const cart = JSON.parse(window.localStorage.getItem("cart") || "[]");
    expect(cart).toHaveLength(1);
    expect(cart[0].nombre).toBe("Silla Gamer Pro");
    expect(cart[0].quantity).toBe(1);
  });
});
