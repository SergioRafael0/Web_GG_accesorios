import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { validarCorreo, validarRequerido } from "../utils/validaciones";
import regionesComunas from "../data/ComunasRegiones.json"; 

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    direccion: "",
    region: "",
    comuna: "",
    cardNombre: "",
    cardNumero: "",
    cardExp: "",
    cardCvv: "",
  });
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckout = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones
    Object.keys(form).forEach((key) => {
      if (!validarRequerido(form[key])) newErrors[key] = "Campo obligatorio";
    });

    if (form.email && !validarCorreo(form.email)) newErrors.email = "Correo inválido";
    if (form.cardNumero && !/^\d{16}$/.test(form.cardNumero)) newErrors.cardNumero = "Número inválido";
    if (form.cardCvv && !/^\d{3,4}$/.test(form.cardCvv)) newErrors.cardCvv = "CVV inválido";

    // Validar región y comuna
    if (!validarRequerido(form.region)) newErrors.region = "Seleccione una región";
    if (!validarRequerido(form.comuna)) newErrors.comuna = "Seleccione una comuna";

    setErrores(newErrors);

    if (Object.keys(newErrors).length === 0) {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/success");
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <h2 className="mb-4">Checkout</h2>
        <p>Tu carrito está vacío.</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Checkout</h2>

      <Table striped bordered hover variant="dark" responsive>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>${Number(item.precio).toLocaleString("es-CL")}</td>
              <td>{item.quantity}</td>
              <td>${(Number(item.precio) * item.quantity).toLocaleString("es-CL")}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4>Total: ${total.toLocaleString("es-CL")}</h4>

      <Form className="mt-4" onSubmit={handleCheckout}>
        <h5>Datos del comprador</h5>

        <Form.Group className="mb-3">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            isInvalid={!!errores.nombre}
            className="bg-dark text-white border-secondary"
          />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={!!errores.email}
            className="bg-dark text-white border-secondary"
          />
          <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Dirección de envío</Form.Label>
          <Form.Control
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            isInvalid={!!errores.direccion}
            className="bg-dark text-white border-secondary"
          />
          <Form.Control.Feedback type="invalid">{errores.direccion}</Form.Control.Feedback>
        </Form.Group>

        {/* Select Región */}
        <Form.Group className="mb-3">
          <Form.Label>Región</Form.Label>
          <Form.Select
            name="region"
            value={form.region}
            onChange={(e) => {
              handleChange(e);
              setForm((prev) => ({ ...prev, comuna: "" })); // reset comuna al cambiar región
            }}
            isInvalid={!!errores.region}
            className="bg-dark text-white border-secondary"
          >
            <option value="">Seleccione una región</option>
            {regionesComunas.map((r) => (
              <option key={r.region} value={r.region}>
                {r.region}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
        </Form.Group>

        {/* Select Comuna */}
        <Form.Group className="mb-3">
          <Form.Label>Comuna</Form.Label>
          <Form.Select
            name="comuna"
            value={form.comuna}
            onChange={handleChange}
            isInvalid={!!errores.comuna}
            className="bg-dark text-white border-secondary"
            disabled={!form.region}
          >
            <option value="">Seleccione una comuna</option>
            {form.region &&
              regionesComunas
                .find((r) => r.region === form.region)
                .comunas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
        </Form.Group>

        <h5 className="mt-4">Datos de la tarjeta</h5>
        <Form.Group className="mb-3">
          <Form.Label>Nombre en la tarjeta</Form.Label>
          <Form.Control
            type="text"
            name="cardNombre"
            value={form.cardNombre}
            onChange={handleChange}
            isInvalid={!!errores.cardNombre}
            className="bg-dark text-white border-secondary"
          />
          <Form.Control.Feedback type="invalid">{errores.cardNombre}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Número de tarjeta</Form.Label>
          <Form.Control
            type="text"
            name="cardNumero"
            value={form.cardNumero}
            onChange={handleChange}
            isInvalid={!!errores.cardNumero}
            className="bg-dark text-white border-secondary"
          />
          <Form.Control.Feedback type="invalid">{errores.cardNumero}</Form.Control.Feedback>
        </Form.Group>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Fecha expiración (MM/AA)</Form.Label>
              <Form.Control
                type="text"
                name="cardExp"
                value={form.cardExp}
                onChange={handleChange}
                isInvalid={!!errores.cardExp}
                className="bg-dark text-white border-secondary"
              />
              <Form.Control.Feedback type="invalid">{errores.cardExp}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="text"
                name="cardCvv"
                value={form.cardCvv}
                onChange={handleChange}
                isInvalid={!!errores.cardCvv}
                className="bg-dark text-white border-secondary"
              />
              <Form.Control.Feedback type="invalid">{errores.cardCvv}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Button
          variant="primary"
          type="submit"
          className="w-100 py-2 fw-semibold"
          style={{ backgroundColor: "#ff2d95", border: "none" }}
        >
          Finalizar Compra
        </Button>
      </Form>
    </Container>
  );
}
