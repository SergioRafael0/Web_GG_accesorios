import React, { useEffect, useState } from "react";
import { Container, Table, Alert } from "react-bootstrap";
import { listMyOrders } from "../services/orders";

export default function Orders() {
  const estadoES = (s) => {
    const k = String(s || "").toUpperCase();
    const map = {
      CREATED: "Creada",
      PENDING: "Pendiente",
      PROCESSING: "Procesándose",
      CONFIRMED: "Confirmada",
      PAID: "Pagada",
      SHIPPED: "Enviada",
      DELIVERED: "Entregada",
      CANCELED: "Cancelada",
      FAILED: "Fallida",
      REFUNDED: "Reembolsada",
    };
    return map[k] || "Desconocido";
  };
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [diagnostico, setDiagnostico] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listMyOrders();
        if (Array.isArray(data)) {
          setOrders(data);
          setError("");
          setDiagnostico(null);
        } else if (data && Array.isArray(data.items)) {
          setOrders(data.items);
          setError("Backend no disponible. Mostrando órdenes locales.");
          setDiagnostico({ source: data.source, code: data.code, status: data.status, error: data.error });
        } else {
          setOrders([]);
          setError("No se pudo cargar órdenes");
          setDiagnostico(null);
        }
      } catch {
        setOrders([]);
        setError("No se pudo cargar órdenes");
        setDiagnostico(null);
      }
    })();
  }, []);

  return (
    <Container className="py-5 text-white">
      <h2 className="mb-4 text-white">Mis Órdenes</h2>
      {error ? <Alert variant="warning">{error}</Alert> : null}
      {diagnostico ? (
        <div className="mb-3">
          <p className="text-white-50">Fuente: {diagnostico.source} · Código: {diagnostico.code} · Estado: {diagnostico.status}</p>
          <p className="text-white-50">Detalle: {diagnostico.error}</p>
        </div>
      ) : null}
      {orders.length === 0 ? (
        <p className="text-white">No tienes órdenes registradas.</p>
      ) : (
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{estadoES(o.status || "CREATED")}</td>
                <td>{o.fechaPedido ? new Date(o.fechaPedido).toLocaleString() : (o.createdAt ? new Date(o.createdAt).toLocaleString() : "-")}</td>
                <td>${Number(o.total || 0).toLocaleString("es-CL")}</td>
                <td>{Array.isArray(o.items) ? o.items.length : 0}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
