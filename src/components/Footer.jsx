import React from "react";
import { Container, Nav } from "react-bootstrap";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-center text-white py-4 border-top border-secondary mt-5">
      <Container>
        <p className="mb-2">
          © {year} GG Accesorios — Hecho con pasión por gaming y anime 🎮
        </p>
        <Nav className="justify-content-center">
          <Nav.Link href="#" className="text-white-50">
            Política de envío
          </Nav.Link>
          <Nav.Link href="#" className="text-white-50">
            Términos
          </Nav.Link>
          <Nav.Link href="/carrito" className="text-white-50">
            Carrito (0)
          </Nav.Link>
        </Nav>
      </Container>
    </footer>
  );
}