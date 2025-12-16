import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { checkoutCreate, checkoutConfirm } from "../services/orders";
import { validarCorreo, validarRequerido } from "../utils/validaciones";

export default function Resumen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [errores, setErrores] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const hasToken = (() => {
    try {
      return !!localStorage.getItem("token");
    } catch {
      return false;
    }
  })();
  const orderDraft = location.state?.orderDraft || (() => {
    try {
      const raw = localStorage.getItem("pendingOrder");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  if (!orderDraft) {
    return (
      <Container className="py-5 text-center">
        <h2 className="mb-3">No hay pedido para confirmar</h2>
        <Button variant="secondary" onClick={() => navigate("/cart")}>Volver al carrito</Button>
      </Container>
    );
  }

  const handleConfirm = async () => {
    if (isConfirming) return;
    setIsConfirming(true);
    try {
      const errs = [];
      const c = orderDraft.customer || {};
      if (!validarRequerido(c.nombre)) errs.push("Nombre completo");
      if (!validarCorreo(c.email)) errs.push("Email");
      if (!validarRequerido(c.direccion)) errs.push("Dirección de envío");
      if (!validarRequerido(c.region)) errs.push("Región");
      if (!validarRequerido(c.comuna)) errs.push("Comuna");
      if (!validarRequerido(c.codigoPostal) || !/^\d{5}$/.test(String(c.codigoPostal || ""))) errs.push("Código Postal (5 dígitos)");
      if (!validarRequerido(orderDraft.envio)) errs.push("Método de envío");
      if (!validarRequerido(orderDraft.pago)) errs.push("Método de pago");
      if (orderDraft.pago === "tarjeta") {
        const cd = orderDraft.cardData || {};
        if (!validarRequerido(cd.nombre)) errs.push("Nombre en tarjeta");
        if (!validarRequerido(cd.numero)) errs.push("Número de tarjeta");
        if (!validarRequerido(cd.exp)) errs.push("Expiración");
        if (!validarRequerido(cd.cvv)) errs.push("CVV");
      }
      if (errs.length > 0) {
        setErrores(errs);
        setIsConfirming(false);
        return;
      }
      const payload = {
        items: (orderDraft.items || []).map((it) => ({
          productoId: it.id,
          nombre: it.nombre,
          precioUnitario: Number(it.precio),
          cantidad: Number(it.quantity),
        })),
        total: Number(orderDraft.total || 0),
        metodoEnvio: orderDraft.envio,
        metodoPago: orderDraft.pago,
        destinatario: orderDraft.customer?.nombre,
        direccion: orderDraft.customer?.direccion,
        region: orderDraft.customer?.region,
        ciudad: orderDraft.customer?.comuna,
        codigoPostal: String(orderDraft.customer?.codigoPostal || "").replace(/\D/g, "").slice(0, 5),
      };
      const order = await checkoutCreate(payload);
      if (order && order._fallback) {
        setAlertas((prev) => [...prev, `No se pudo registrar la orden en backend (código ${order._code}, estado ${order._status}). Se guardó localmente.`]);
      }
      const ref = `WEB-${Date.now()}`;
      const pago = await checkoutConfirm(order?.id, ref);
      if (pago && pago._fallback) {
        setAlertas((prev) => [...prev, `No se pudo confirmar el pago en backend (código ${pago._code}, estado ${pago._status}). Se marcó pagado localmente.`]);
      }
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("cart");
      try { window.dispatchEvent(new Event("cartUpdated")); } catch { /* noop */ }
      navigate("/success", { state: { orderId: order?.id || pago?.ordenId, order: order, orderDraft } });
    } catch (e) {
      navigate("/failure", { state: { error: e?.message || "Error al confirmar compra" } });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Container className="py-5 text-white">
      <h2 className="mb-4">Resumen de Compra</h2>
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
          {orderDraft.items.map((it) => (
            <tr key={it.id}>
              <td>{it.nombre}</td>
              <td>${Number(it.precio).toLocaleString("es-CL")}</td>
              <td>{it.quantity}</td>
              <td>${(Number(it.precio) * it.quantity).toLocaleString("es-CL")}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h4>Total: ${Number(orderDraft.total).toLocaleString("es-CL")}</h4>

      <div className="mt-4">
        <h5 className="text-white">Datos de envío</h5>
        <p className="text-white">{orderDraft.customer.nombre} — {orderDraft.customer.email}</p>
        <p className="text-white">{orderDraft.customer.direccion}, {orderDraft.customer.comuna}, {orderDraft.customer.region}</p>
        <p className="text-white">Método de envío: {orderDraft.envio}</p>
        <p className="text-white">Método de pago: {orderDraft.pago}</p>
      </div>

      {errores.length > 0 && (
        <div className="mt-3">
          <p className="text-danger">Completa los datos requeridos: {errores.join(", ")}</p>
        </div>
      )}
      {!hasToken && (
        <div className="mt-3">
          <Alert variant="info">Debes iniciar sesión para registrar la orden en el backend. Si continúas sin sesión, se usará respaldo local.</Alert>
        </div>
      )}
      {alertas.length > 0 && (
        <div className="mt-3">
          {alertas.map((msg, i) => (
            <Alert key={i} variant="warning">{msg}</Alert>
          ))}
        </div>
      )}

      <div className="d-flex gap-2 mt-3">
        <Button variant="secondary" onClick={() => navigate("/checkout")}>Volver</Button>
        <Button style={{ backgroundColor: "#ff2d95", border: "none" }} onClick={handleConfirm}>
          Confirmar compra
        </Button>
      </div>
    </Container>
  );
}
