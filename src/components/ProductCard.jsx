import React from "react";
import { Card, Button } from "react-bootstrap";

export default function ProductCard({ title, price, image, desc }) {
  return (
    <Card className="bg-dark text-white shadow-sm h-100 border-secondary">
      <Card.Img variant="top" src={image} alt={title} />
      <Card.Body>
        <Card.Title className="fw-bold">{title}</Card.Title>
        <Card.Text>{desc}</Card.Text>
        <p className="text-info fw-semibold mb-3">${price.toLocaleString()}</p>
        <Button variant="primary" className="w-100">
          Agregar al carrito
        </Button>
      </Card.Body>
    </Card>
  );
}