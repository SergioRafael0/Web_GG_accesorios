import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard({ id, nombre, precio, imagen, descripcion }) {

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const found = cart.find((item) => item.id === id);

    if (found) {
      found.quantity += 1;
    } else {
      cart.push({ id, nombre, precio, imagen, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Disparar evento para que otros componentes sepan que cambió el carrito
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <Card className="bg-dark text-white border-secondary shadow-sm h-100">
      <Link to={`/productos/${id}`}>
        <Card.Img
          variant="top"
          src={imagen}
          alt={nombre}
          style={{ height: "220px", objectFit: "cover" }}
        />
      </Link>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{nombre}</Card.Title>
        <Card.Text className="text-muted small mb-2">{descripcion}</Card.Text>

        <div className="mt-auto">
          <h6 className="text-info mb-3">
            ${Number(precio).toLocaleString("es-CL")}
          </h6>

          <div className="d-grid gap-2">
            <Button
              as={Link}
              to={`/productos/${id}`}
              variant="outline-light"
              className="w-100"
            >
              Ver detalle
            </Button>

            <Button
              variant="primary"
              className="w-100"
              style={{ backgroundColor: "#ff2d95", border: "none" }}
              onClick={handleAddToCart}
            >
              Añadir al carrito
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
