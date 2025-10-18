import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Failure() {
  return (
    <Container className="py-5 text-center">
      <h2 className="mb-4 text-danger">Error en la compra ❌</h2>
      <p>Hubo un problema procesando tu pago. Intenta nuevamente.</p>
      <Link to="/checkout">
        <Button style={{ backgroundColor: "#ff2d95", border: "none" }}>Reintentar</Button>
      </Link>
    </Container>
  );
}