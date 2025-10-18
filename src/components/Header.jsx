import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function Header() {
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
            <Nav.Link as={Link} to="/carrito">
              🛒 Carrito <span className="badge bg-primary ms-1">0</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}