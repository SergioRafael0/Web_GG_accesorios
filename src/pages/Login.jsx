import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { validarCorreo, validarRequerido } from "../utils/validaciones";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones básicas (sin validarPassword)
    if (!validarCorreo(formData.email)) newErrors.email = "Correo inválido";
    if (!validarRequerido(formData.password)) newErrors.password = "Ingrese su contraseña";

    setErrores(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Verificar usuarios normales en localStorage
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const user = usuarios.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      // Verificar credenciales de admin
      const admin =
        formData.email === "adminggaccesorios@gmail.com" &&
        formData.password === "Contraseñasegura123!";

      if (user || admin) {
        localStorage.setItem(
          "usuarioActivo",
          JSON.stringify(user || { email: formData.email, rol: admin ? "admin" : "user" })
        );

        if (admin) {
          navigate("/admin"); // Redirige al panel de administración
        } else {
          navigate("/"); // Usuario normal
        }
      } else {
        setErrores({ general: "Usuario o contraseña incorrectos" });
      }
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="bg-dark text-white shadow-lg border-secondary p-4">
            <Card.Body>
              <h2 className="text-center mb-4 fw-bold">Iniciar Sesión</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errores.email}
                    className="bg-dark text-white border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errores.password}
                    className="bg-dark text-white border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {errores.general && <p className="text-danger">{errores.general}</p>}

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 fw-semibold"
                  style={{ backgroundColor: "#ff2d95", border: "none" }}
                >
                  Entrar
                </Button>
              </Form>

              <p className="text-center mt-3 text-white-50">
                ¿No tienes una cuenta?{" "}
                <a href="/Register" className="text-decoration-none text-info">
                  Regístrate aquí
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
