import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Checkout from "../pages/Checkout.jsx";
import Resumen from "../pages/Resumen.jsx";
import Success from "../pages/Success.jsx";

describe("Flujo de Checkout y Resumen", () => {
  it("al confirmar, valida y no navega sin datos", () => {
    localStorage.setItem("cart", JSON.stringify([{ id: 1, nombre: "Prod", precio: 1000, quantity: 1 }]));
    render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/resumen" element={<Resumen />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Ir a resumen"));
    expect(screen.getByText("Resumen de Compra")).toBeTruthy();
    fireEvent.click(screen.getByText("Confirmar compra"));
    expect(screen.getByText("Resumen de Compra")).toBeTruthy();
  });

  it("con datos mínimos, confirma y navega a Success", async () => {
    localStorage.setItem("cart", JSON.stringify([{ id: 1, nombre: "Prod", precio: 1000, quantity: 1 }]));
    render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/resumen" element={<Resumen />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Juan Perez" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "juan@example.com" } });
    fireEvent.change(screen.getByLabelText("Dirección de envío"), { target: { value: "Calle 123" } });
    fireEvent.change(screen.getByLabelText("Código Postal"), { target: { value: "12345" } });
    // Región y comuna
    const regionSelect = screen.getByLabelText("Región");
    fireEvent.change(regionSelect, { target: { value: regionSelect.querySelector("option:not([value=''])").value } });
    const comunaSelect = screen.getByLabelText("Comuna");
    const anyComuna = comunaSelect.querySelector("option:not([value=''])");
    if (anyComuna) fireEvent.change(comunaSelect, { target: { value: anyComuna.value } });
    // Métodos (sin tarjeta)
    fireEvent.change(screen.getByLabelText("Método de envío"), { target: { value: "retiro" } });
    fireEvent.change(screen.getByLabelText("Método de pago"), { target: { value: "local" } });
    fireEvent.click(screen.getByText("Ir a resumen"));
    expect(screen.getByText("Resumen de Compra")).toBeTruthy();
    fireEvent.click(screen.getByText("Confirmar compra"));
    expect(await screen.findByText(/Compra exitosa/i)).toBeTruthy();
  });
});
