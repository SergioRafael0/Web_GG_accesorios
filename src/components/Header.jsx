import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      const arr = Array.isArray(saved) ? saved : [];
      const totalQty = arr.reduce(
        (sum, item) => sum + (Number(item.quantity) || Number(item.qty) || 0),
        0
      );
      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount(); // Inicial
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="py-3 border-bottom border-secondary">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-uppercase">
          GG <span style={{ color: "#ff2d95" }}>Accesorios</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
            <Nav.Link href="#destacados">Destacados</Nav.Link>
            <Nav.Link href="#nosotros">Nosotros</Nav.Link>
            <Nav.Link href="#contacto">Contacto</Nav.Link>
            <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
            <Nav.Link as={Link} to="/cart">
              🛒 Carrito <span className="badge bg-primary ms-1">{cartCount}</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
