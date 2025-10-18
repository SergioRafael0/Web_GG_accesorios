import React from "react";
import { Card, Button } from "react-bootstrap";

export default function ProductCard({ nombre, precio, imagen, descripcion }) {
  return (
    <Card className="bg-dark text-white shadow-sm h-100 border-secondary">
      <Card.Img variant="top" src={imagen} alt={nombre} />
      <Card.Body>
        <Card.Title className="fw-bold">{nombre}</Card.Title>
        <Card.Text>{descripcion}</Card.Text>
        <p className="text-info fw-semibold mb-3">
          ${precio ? precio.toLocaleString() : "0"}
        </p>
        <Button variant="primary" className="w-100">
          Agregar al carrito
        </Button>
      </Card.Body>
    </Card>
  );
}
