import React, { useState, useEffect } from "react";
import { Container, Table, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import regionesComunas from "../data/ComunasRegiones.json";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    direccion: "",
    region: "",
    comuna: "",
    codigoPostal: "",
    metodoEnvio: "",
    metodoPago: "",
    cardNombre: "",
    cardNumero: "",
    cardExp: "",
    cardCvv: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let savedCart = [];
    try {
      savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      savedCart = savedCart.map((it) => ({
        ...it,
        quantity: Number(it.quantity) || 1,
      }));
    } catch {
      savedCart = [];
    }
    setCart(savedCart);
    try {
      const raw = localStorage.getItem("checkoutPrefill");
      const datos = raw ? JSON.parse(raw) : null;
      const userRaw = localStorage.getItem("usuarioActivo");
      const user = userRaw ? JSON.parse(userRaw) : null;
      const emailPref = user?.email || "";
      if (datos) {
        setForm((prev) => ({
          ...prev,
          nombre: datos.nombre || prev.nombre,
          email: emailPref || prev.email,
          direccion: datos.direccion || prev.direccion,
          region: datos.region || prev.region,
          comuna: datos.ciudad || prev.comuna,
          codigoPostal: String(datos.codigoPostal || prev.codigoPostal || "").replace(/\D/g, "").slice(0, 5),
        }));
      } else if (emailPref) {
        setForm((prev) => ({ ...prev, email: emailPref }));
      }
    } catch { void 0; }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  const availableComunas = (() => {
    const entry = regionesComunas.find((r) => r.region === form.region);
    return entry ? entry.comunas : [];
  })();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "region") {
      setForm((prev) => ({ ...prev, region: value, comuna: "" }));
    } else if (name === "codigoPostal") {
      const v = String(value || "").replace(/\D/g, "").slice(0, 5);
      setForm((prev) => ({ ...prev, codigoPostal: v }));
    } else if (name === "metodoEnvio") {
      const envio = value;
      setForm((prev) => {
        let nextPago = prev.metodoPago;
        if (envio === "retiro") {
          nextPago = "local";
        } else if (envio === "domicilio") {
          if (nextPago === "local") nextPago = "";
        }
        return { ...prev, metodoEnvio: envio, metodoPago: nextPago };
      });
    } else if (name === "metodoPago") {
      const pago = value;
      setForm((prev) => {
        if (prev.metodoEnvio === "retiro" && pago !== "local") return { ...prev };
        if (prev.metodoEnvio === "domicilio" && pago === "local") return { ...prev };
        return { ...prev, metodoPago: pago };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const continueToResumen = () => {
    const orderDraft = {
      items: cart.map((it) => ({ id: it.id, nombre: it.nombre, precio: it.precio, quantity: it.quantity })),
      total,
      customer: {
        nombre: form.nombre,
        email: form.email,
        direccion: form.direccion,
        region: form.region,
        comuna: form.comuna,
        codigoPostal: form.codigoPostal,
      },
      envio: form.metodoEnvio,
      pago: form.metodoPago,
      cardData: form.metodoPago === "tarjeta"
        ? {
            nombre: form.cardNombre,
            numero: form.cardNumero,
            exp: form.cardExp,
            cvv: form.cardCvv,
          }
        : null,
    };
    localStorage.setItem("pendingOrder", JSON.stringify(orderDraft));
    navigate("/resumen", { state: { orderDraft } });
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <h2 className="mb-4">Checkout</h2>
        <p>Tu carrito está vacío.</p>
      </Container>
    );
  }

  const canGoResumen = cart.length > 0;

  return (
    <Container className="py-5 text-white">
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

      <h4 className="text-white">Total: ${total.toLocaleString("es-CL")}</h4>

      <div className="mt-4">
        <h5 className="text-white mb-3">Datos de envío</h5>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="direccion">
                <Form.Label>Dirección de envío</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Calle y número"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="region">
                <Form.Label>Región</Form.Label>
                <Form.Select name="region" value={form.region} onChange={handleChange} aria-label="Región">
                  <option value="">Selecciona región</option>
                  {regionesComunas.map((r) => (
                    <option key={r.region} value={r.region}>
                      {r.region}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="comuna">
                <Form.Label>Comuna</Form.Label>
                <Form.Select name="comuna" value={form.comuna} onChange={handleChange} aria-label="Comuna">
                  <option value="">Selecciona comuna</option>
                  {availableComunas.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group controlId="codigoPostal">
                <Form.Label>Código Postal</Form.Label>
                <Form.Control
                  type="text"
                  name="codigoPostal"
                  value={form.codigoPostal}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={5}
                  pattern="\\d{5}"
                  placeholder="00000"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="metodoEnvio">
                <Form.Label>Método de envío</Form.Label>
                <Form.Select
                  name="metodoEnvio"
                  value={form.metodoEnvio}
                  onChange={handleChange}
                  aria-label="Método de envío"
                >
                  <option value="">Selecciona método</option>
                  <option value="domicilio">Envío a domicilio</option>
                  <option value="retiro">Retiro en tienda</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="metodoPago">
                <Form.Label>Método de pago</Form.Label>
                <Form.Select
                  name="metodoPago"
                  value={form.metodoPago}
                  onChange={handleChange}
                  aria-label="Método de pago"
                >
                  <option value="">Selecciona pago</option>
                  {form.metodoEnvio === "retiro" ? (
                    <>
                      <option value="local">Pago en tienda</option>
                    </>
                  ) : (
                    <>
                      <option value="tarjeta">Tarjeta de crédito/débito</option>
                      <option value="contraentrega">Pago al recibir</option>
                    </>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {form.metodoPago === "tarjeta" && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="cardNombre">
                  <Form.Label>Nombre en tarjeta</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNombre"
                    value={form.cardNombre}
                    onChange={handleChange}
                    placeholder="Nombre como aparece en la tarjeta"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cardNumero">
                  <Form.Label>Número de tarjeta</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNumero"
                    value={form.cardNumero}
                    onChange={handleChange}
                    placeholder="0000 0000 0000 0000"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mt-3">
                <Form.Group controlId="cardExp">
                  <Form.Label>Expiración (MM/AA)</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardExp"
                    value={form.cardExp}
                    onChange={handleChange}
                    placeholder="MM/AA"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mt-3">
                <Form.Group controlId="cardCvv">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="password"
                    name="cardCvv"
                    value={form.cardCvv}
                    onChange={handleChange}
                    placeholder="***"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </Form>
      </div>

      <div className="mt-4">
        <Button
          style={{ backgroundColor: "#ff2d95", border: "none" }}
          className="w-100 py-2 fw-semibold"
          disabled={!canGoResumen}
          onClick={continueToResumen}
        >
          Ir a resumen
        </Button>
      </div>
    </Container>
  );
}
