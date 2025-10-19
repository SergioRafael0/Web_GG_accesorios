import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { validarCorreo, validarPassword, validarRequerido, validarCoincidencia } from "../utils/validaciones";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmar: "",
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones
    if (!validarRequerido(formData.name)) newErrors.name = "Nombre requerido";
    if (!validarCorreo(formData.email)) newErrors.email = "Correo inválido";
    if (!validarPassword(formData.password)) newErrors.password = "Contraseña inválida";
    if (!validarCoincidencia(formData.password, formData.confirmar))
      newErrors.confirmar = "Las contraseñas no coinciden";

    setErrores(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Guardar usuario en localStorage
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      usuarios.push({
        nombre: formData.name,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      navigate("/login");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="bg-dark text-white shadow-lg border-secondary p-4">
            <Card.Body>
              <h2 className="text-center mb-4 fw-bold">Registro</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errores.name}
                    className="bg-dark text-white border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">{errores.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errores.email}
                    className="bg-dark text-white border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errores.password}
                    className="bg-dark text-white border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmar"
                    value={formData.confirmar}
                    onChange={handleChange}
                    isInvalid={!!errores.confirmar}
                    className="bg-dark text-white border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">{errores.confirmar}</Form.Control.Feedback>
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
