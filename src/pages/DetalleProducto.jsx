import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { getProductoById } from "../services/productos";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

          <div className="d-grid gap-2">
            <Button
              variant="primary"
              style={{ backgroundColor: "#ff2d95", border: "none" }}
              onClick={() => {
                const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                const found = cart.find((it) => it.id === producto.id);
                if (found) {
                  // usar la propiedad 'quantity' de forma consistente
                  found.quantity = (found.quantity || 0) + 1;
                } else {
                  cart.push({ ...producto, quantity: 1 });
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                window.dispatchEvent(new Event("cartUpdated"));
                // evita alert() para no romper UX; dejar comentario para cambiar a toast si se desea
                alert(`${producto.nombre} agregado al carrito`);
              }}
            >
              Añadir al carrito
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
