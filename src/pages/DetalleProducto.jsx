import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Image, Form } from "react-bootstrap";
import { getProductoById } from "../services/productos";
import { addItem as apiAddItem } from "../services/cart";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getProductoById(id);
        if (mounted) {
          setProducto(data || null);
          setError("");
        }
      } catch {
        if (mounted) {
          setProducto(null);
          setError("No se pudo cargar el producto");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center text-white py-5">
        <h3>Cargando producto...</h3>
      </Container>
    );
  }

  if (error || !producto) {
    return (
      <Container className="text-center text-white py-5">
        <h3 className="text-danger">No se pudo cargar el producto</h3>
      </Container>
    );
  }

  return (
    <Container className="py-5 text-white">
      <Row className="align-items-center">
        <Col md={6} className="text-center mb-4 mb-md-0">
          <Image
            src={resolveImage(producto.imagen)}
            alt={producto.nombre}
            fluid
            rounded
            className="shadow-lg"
          />
        </Col>
        <Col md={6}>
          <h2 className="fw-bold">{producto.nombre}</h2>
          <p className="text-muted">{producto.descripcion}</p>
          <h4 className="text-info mb-4">
            ${Number(producto.precio).toLocaleString("es-CL")}
          </h4>
          {typeof producto.stock === "number" ? (
            <div className="text-white-50 mb-3">Stock: {producto.stock}</div>
          ) : null}

          <div className="d-grid gap-2">
            <Form.Group className="mb-2" controlId="cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={typeof producto.stock === "number" ? Math.max(producto.stock, 1) : undefined}
                value={qty}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isNaN(v)) return;
                  const min = 1;
                  const max = typeof producto.stock === "number" ? Math.max(producto.stock, 1) : Infinity;
                  setQty(Math.min(Math.max(v, min), max));
                }}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
            <Button
              variant="primary"
              style={{ backgroundColor: "#ff2d95", border: "none" }}
              onClick={() => {
                if (typeof producto.stock === "number" && producto.stock <= 0) {
                  alert(`${producto.nombre} no está disponible`);
                  return;
                }
                const token = localStorage.getItem("token");
                (async () => {
                  if (token) {
                    try {
                      await apiAddItem(producto.id, qty);
                      window.dispatchEvent(new Event("cartUpdated"));
                      alert(`${producto.nombre} agregado al carrito`);
                      return;
                    } catch {
                      // fallback local
                    }
                  }
                  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                  const found = cart.find((it) => it.id === producto.id);
                  if (found) {
                    const nextQty = (Number(found.quantity) || Number(found.qty) || 0) + qty;
                    if (typeof producto.stock === "number") {
                      found.quantity = Math.min(nextQty, Math.max(producto.stock, 0));
                    } else {
                      found.quantity = nextQty;
                    }
                  } else {
                    let initialQty = qty;
                    if (typeof producto.stock === "number") {
                      initialQty = Math.min(qty, Math.max(producto.stock, 0));
                    }
                    cart.push({ ...producto, quantity: initialQty });
                  }
                  localStorage.setItem("cart", JSON.stringify(cart));
                  window.dispatchEvent(new Event("cartUpdated"));
                  alert(`${producto.nombre} agregado al carrito`);
                })();
              }}
            >
              {typeof producto.stock === "number" && producto.stock <= 0 ? "Sin stock" : "Añadir al carrito"}
            </Button>

            <Button as={Link} to="/" variant="outline-light">
              Volver al inicio
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
  const resolveImage = (u) => {
    let s = String(u || "").trim();
    s = s.replace(/^`+|`+$/g, "");
    s = s.replace(/^"+|"+$/g, "");
    s = s.replace(/^'+|'+$/g, "");
    if (!s) return "https://via.placeholder.com/800x450?text=Sin+imagen";
    if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
    if (s.startsWith("/")) return encodeURI(s);
    return s;
  };
