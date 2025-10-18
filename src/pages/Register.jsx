import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registro:", formData);
    navigate("/login"); // redirige al login
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="bg-dark text-white shadow-lg border-secondary p-4">
            <Card.Body>
              <h2 className="text-center mb-4 fw-bold">Registro</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 fw-semibold"
                  style={{ backgroundColor: "#ff2d95", border: "none" }}
                >
                  Registrarse
                </Button>
              </Form>

              <p className="text-center mt-3 text-white-50">
                ¿Ya tienes cuenta?{" "}
                <a href="/login" className="text-info text-decoration-none">
                  Iniciar sesión
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}