import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { validarRequerido, validarCorreo, validarPassword, validarCoincidencia, validarTelefono, validarDireccionMinima } from "../utils/validaciones";
import { register as apiRegister } from "../services/auth";
import regionesComunas from "../data/ComunasRegiones.json";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmar: "",
    apellido: "",
    telefono: "",
    direccion: "",
    region: "",
    ciudad: "",
    codigoPostal: "",
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "region") {
      setFormData((prev) => ({ ...prev, region: value, ciudad: "" }));
    } else if (name === "codigoPostal") {
      const v = String(value || "").replace(/\D/g, "").slice(0, 5);
      setFormData({ ...formData, codigoPostal: v });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
    if (formData.telefono && !validarTelefono(formData.telefono)) newErrors.telefono = "Teléfono inválido";
    if (formData.direccion && !validarDireccionMinima(formData.direccion)) newErrors.direccion = "Dirección demasiado corta";
    if (formData.codigoPostal && !/^\d{5}$/.test(formData.codigoPostal)) newErrors.codigoPostal = "Código postal debe tener 5 dígitos";

    setErrores(newErrors);

    if (Object.keys(newErrors).length === 0) {
      (async () => {
        try {
          await apiRegister({
            email: formData.email,
            password: formData.password,
            nombre: formData.name,
            apellido: formData.apellido || null,
            telefono: formData.telefono || null,
            direccion: formData.direccion || null,
            region: formData.region || null,
            ciudad: formData.ciudad || null,
            codigoPostal: formData.codigoPostal || null,
            role: "USER",
          });
          navigate("/login");
        } catch {
          setErrores({ general: "No se pudo registrar el usuario" });
        }
      })();
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
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary"
                  />
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
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary"
                  />
                  {errores.telefono && <div className="text-danger small mt-1">{errores.telefono}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary"
                  />
                  {errores.direccion && <div className="text-danger small mt-1">{errores.direccion}</div>}
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Región</Form.Label>
                      <Form.Select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="bg-dark text-white border-secondary"
                      >
                        <option value="">Seleccione una región</option>
                        {regionesComunas.map((r) => (
                          <option key={r.region} value={r.region}>{r.region}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Comuna</Form.Label>
                      <Form.Select
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        className="bg-dark text-white border-secondary"
                        disabled={!formData.region}
                      >
                        <option value="">Seleccione una comuna</option>
                        {formData.region && regionesComunas.find((r) => r.region === formData.region)?.comunas.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Código Postal</Form.Label>
                  <Form.Control
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={5}
                    pattern="\\d{5}"
                    className="bg-dark text-white border-secondary"
                  />
                  {errores.codigoPostal && <div className="text-danger small mt-1">{errores.codigoPostal}</div>}
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
