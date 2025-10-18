import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Button, Badge } from "react-bootstrap";

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((p) => String(p.id) === String(id));
        setProducto(found || null);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (producto === null) {
    return (
      <Container className="py-5 text-center">
        <p className="text-muted">Cargando producto...</p>
      </Container>
    );
  }

  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <h3>Producto no encontrado</h3>
        <p className="text-muted">El producto que buscas no existe.</p>
        <Button as={Link} to="/productos" variant="outline-light">
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const found = cart.find((it) => String(it.id) === String(producto.id));
    if (found) found.qty += 1;
    else cart.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${producto.nombre} agregado al carrito`);
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          <Image src={producto.imagen} alt={producto.nombre} fluid rounded style={{ objectFit: "cover", width: "100%", maxHeight: 500 }} />
        </Col>

        <Col md={6} className="text-white">
          <h2 className="fw-bold">{producto.nombre} <Badge bg="info" text="dark" className="ms-2">{producto.categoria}</Badge></h2>
          <p className="text-muted">{producto.descripcion}</p>
          <h3 className="text-info">${Number(producto.precio).toLocaleString("es-CL")}</h3>

          <div className="d-flex gap-2 mt-4">
            <Button style={{ backgroundColor: "#ff2d95", border: "none" }} onClick={handleAddToCart}>
              Añadir al carrito
            </Button>
            <Button variant="outline-light" onClick={() => navigate(-1)}>
              Volver
            </Button>
            <Button variant="secondary" as={Link} to="/checkout">
              Pagar ahora
            </Button>
          </div>

          <hr className="my-4" />
          <h5>Detalles</h5>
          <ul>
            <li>SKU: {producto.sku || "N/A"}</li>
            <li>Stock: {producto.stock ?? "Sin info"}</li>
            <li>Tags: {(producto.tags || []).join(", ") || "—"}</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
