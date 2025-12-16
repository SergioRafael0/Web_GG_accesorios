import React from "react";
import { Container, Button, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Success() {
  const location = useLocation();
  const order = location.state?.order || null;
  let orderId = null;
  try {
    const params = new URLSearchParams(window.location.search);
    orderId = params.get("orderId");
  } catch {
    void 0;
  }
  try {
    const st = history.state;
    if (st && st.usr && st.usr.orderId) orderId = st.usr.orderId;
  } catch {
    void 0;
  }
  const orderDraft = location.state?.orderDraft || (() => {
    try {
      const raw = localStorage.getItem("pendingOrder");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const mostrarBoleta = !!orderDraft;
  const total = Number(orderDraft?.total || 0);
  const ivaRate = 0.19;
  const neto = Math.round(total / (1 + ivaRate));
  const iva = Math.max(0, total - neto);

  return (
    <Container className="py-5 text-center text-white">
      <h2 className="mb-4 text-success">¡Compra exitosa! 🎉</h2>
      <p className="text-white">Gracias por tu compra. Tu pedido está en proceso.</p>
      {orderId ? <p className="text-white"><strong>Número de orden:</strong> {orderId}</p> : null}
      {order && order._fallback ? (
        <p className="text-white-50">Backend no disponible. La orden se guardó localmente.</p>
      ) : null}

      {mostrarBoleta && (
        <div className="mt-4">
          <h4 className="mb-3">Boleta</h4>
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
                <tr key={`${it.id}-${it.nombre}`}>
                  <td>{it.nombre}</td>
                  <td>${Number(it.precio).toLocaleString("es-CL")}</td>
                  <td>{it.quantity}</td>
                  <td>${(Number(it.precio) * it.quantity).toLocaleString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="text-start mt-3">
            <div>Total (con IVA): ${total.toLocaleString("es-CL")}</div>
            <div>Neto (sin IVA): ${neto.toLocaleString("es-CL")}</div>
            <div>IVA (19%): ${iva.toLocaleString("es-CL")}</div>
          </div>
        </div>
      )}

      <Link to="/">
        <Button style={{ backgroundColor: "#ff2d95", border: "none" }}>Volver al inicio</Button>
      </Link>
    </Container>
  );
}
