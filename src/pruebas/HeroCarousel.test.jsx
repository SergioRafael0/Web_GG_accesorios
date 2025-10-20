import { render, screen, fireEvent } from "@testing-library/react";
import HeroCarousel from "../components/HeroCarousel.jsx"; // Ajusta según tu path real
import { describe, it, expect } from "vitest";

describe("HeroCarousel", () => {
  it("renderiza correctamente los slides iniciales", () => {
    render(<HeroCarousel />);

    // Tomar la primera slide usando ID
    const firstSlide = document.querySelector("#slide-0");
    expect(firstSlide).toBeTruthy();
    expect(firstSlide.classList.contains("active")).toBe(true);

    // Comprobar que las demás slides no están activas
    const secondSlide = document.querySelector("#slide-1");
    expect(secondSlide.classList.contains("active")).toBe(false);
  });

  it("navega al siguiente y anterior slide al hacer click", () => {
    render(<HeroCarousel />);
    const nextBtn = screen.getByLabelText("Siguiente");
    const prevBtn = screen.getByLabelText("Anterior");

    // Click next
    fireEvent.click(nextBtn);
    expect(document.querySelector("#slide-1").classList.contains("active")).toBe(true);

    // Click prev
    fireEvent.click(prevBtn);
    expect(document.querySelector("#slide-0").classList.contains("active")).toBe(true);
  });

  it("navega a slide específico al clickear en un dot", () => {
    render(<HeroCarousel />);
    const dot2 = document.querySelector('[data-slide="2"]');
    fireEvent.click(dot2);
    expect(document.querySelector("#slide-2").classList.contains("active")).toBe(true);
  });
});
