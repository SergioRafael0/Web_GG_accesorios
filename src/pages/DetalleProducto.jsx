import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Image } from "react-bootstrap";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => {
        const encontrado = data.find((p) => p.id === parseInt(id));
        setProducto(encontrado || null);
      })
      .catch((err) => console.error("Error cargando detalle:", err));
  }, [id]);

  if (!producto) {
    return (
      <Container className="text-center text-white py-5">
        <h3>Cargando producto...</h3>
      </Container>
    );
  }

  return (
    <Container className="py-5 text-white">
      <Row className="align-items-center">
        <Col md={6} className="text-center mb-4 mb-md-0">
          <Image
            src={producto.imagen}
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
                if (found) found.qty += 1;
                else cart.push({ ...producto, qty: 1 });
                localStorage.setItem("cart", JSON.stringify(cart));
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
