import { render, screen } from "@testing-library/react";
import Header from "../components/Header.jsx"; // Ajusta según tu path real
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

describe("Header/Navbar", () => {
  it("muestra correctamente los enlaces principales y el logo", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // 1️⃣ Logo GG Accesorios
    const logo = screen.getByText("GG", { exact: false });
    expect(logo).toBeTruthy();

    // 2️⃣ Enlaces principales
    expect(screen.getByText("Inicio")).toBeTruthy();
    expect(screen.getByText("Productos")).toBeTruthy();
    expect(screen.getByText("Destacados")).toBeTruthy();
    expect(screen.getByText("Nosotros")).toBeTruthy();
    expect(screen.getByText("Contacto")).toBeTruthy();
    expect(screen.getByText("Iniciar Sesión")).toBeTruthy();
    expect(screen.getByText(/Carrito/i)).toBeTruthy();
  });
});
