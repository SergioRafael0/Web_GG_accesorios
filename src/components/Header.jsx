import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { logout } from "../services/auth";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const fullName = user ? (user?.profile?.nombre ? `${user.profile.nombre}${user.profile.apellido ? " " + user.profile.apellido : ""}` : (user.email || "")) : "";
  function splitTwoLines(name) {
    const s = String(name || "").trim();
    if (s.length <= 18) return [s, ""];
    const mid = Math.floor(s.length / 2);
    let idx = s.lastIndexOf(" ", mid);
    if (idx === -1) idx = s.indexOf(" ", mid);
    if (idx === -1) return [s.slice(0, mid), s.slice(mid)];
    return [s.slice(0, idx), s.slice(idx + 1)];
  }
  const [nameTop, nameBottom] = splitTwoLines(fullName);

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
    const loadUser = () => {
      try {
        const raw = localStorage.getItem("usuarioActivo");
        const u = raw ? JSON.parse(raw) : null;
        setUser(u || null);
      } catch {
        setUser(null);
      }
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("userUpdated", loadUser);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="py-3 border-bottom border-secondary">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-uppercase">
          GG <span style={{ color: "#ff2d95" }}>Accesorios</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          <Nav>
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
            <Nav.Link as={Link} to="/#destacados">Destacados</Nav.Link>
            <Nav.Link as={Link} to="/#nosotros">Nosotros</Nav.Link>
            <Nav.Link as={Link} to="/#contacto">Contacto</Nav.Link>
            {user ? <Nav.Link as={Link} to="/orders">Mis Órdenes</Nav.Link> : null}
            {user && (["ADMIN","VENDEDOR"].includes(user.role)) ? (
              <Nav.Link as={Link} to="/admin/ordenes">Órdenes</Nav.Link>
            ) : null}
            {user && (["ADMIN","PROD_AD"].includes(user.role)) ? (
              <Nav.Link as={Link} to="/admin/productos">Admin Productos</Nav.Link>
            ) : null}
            {user && (["ADMIN","USERS_AD","USER_AD"].includes(user.role)) ? (
              <Nav.Link as={Link} to="/admin/usuarios">Admin Usuarios</Nav.Link>
            ) : null}
            <Nav.Link as={Link} to="/cart">
              🛒 Carrito <span className="badge bg-primary ms-1">{cartCount}</span>
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            {user ? (
              <div className="d-flex flex-column align-items-end ms-3 border-start border-secondary ps-3">
                <div className="navbar-text text-white d-inline-flex align-items-center mb-1">
                  <span style={{ fontSize: "1rem", marginRight: 6 }}>👤</span>
                  <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1.1 }}>
                    <span>{nameTop}</span>
                    {nameBottom ? <span>{nameBottom}</span> : null}
                  </span>
                </div>
                <Nav.Link as={Link} to="/perfil">Perfil</Nav.Link>
                <Nav.Link
                  onClick={() => {
                    logout();
                    setUser(null);
                    navigate("/");
                  }}
                >
                  Cerrar Sesión
                </Nav.Link>
              </div>
            ) : (
              <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
