import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", address: "", card: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // simulamos pago exitoso
    navigate("/success");
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Checkout</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tarjeta de crédito</Form.Label>
          <Form.Control
            type="text"
            name="card"
            value={formData.card}
            onChange={handleChange}
            required
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>
        <Button type="submit" style={{ backgroundColor: "#ff2d95", border: "none" }}>
          Pagar
        </Button>
      </Form>
    </Container>
  );
}