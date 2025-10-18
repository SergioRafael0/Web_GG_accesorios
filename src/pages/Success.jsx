import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <Container className="py-5 text-center">
      <h2 className="mb-4 text-success">¡Compra exitosa! 🎉</h2>
      <p>Gracias por tu compra. Tu pedido está en proceso.</p>
      <Link to="/">
        <Button style={{ backgroundColor: "#ff2d95", border: "none" }}>Volver al inicio</Button>
      </Link>
    </Container>
  );
}