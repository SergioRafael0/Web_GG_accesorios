import React, { useEffect, useState } from "react";
import { Container, Table, Alert, Modal, Form, Button } from "react-bootstrap";
import { listAllOrdersAdmin, updateOrderPartial } from "../services/orders";

export default function AdminOrdenes() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [diagnostico, setDiagnostico] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ status: "", fechaPedido: "", destinatario: "", direccion: "", region: "", ciudad: "", codigoPostal: "" });
  const [resultMsg, setResultMsg] = useState("");
  const [resultVariant, setResultVariant] = useState("info");
  const userRole = (() => {
    try {
      const raw = localStorage.getItem("usuarioActivo");
      const u = raw ? JSON.parse(raw) : null;
      return u?.role || u?.user?.role || null;
    } catch {
      return null;
    }
  })();
  const estadoES = (s) => {
    const k = String(s || "").toUpperCase();
    const map = {
      CART: "Carrito",
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
  const allowedStatuses = ["CART", "PENDING", "PAID", "CANCELLED"];
  const toLocalDT = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, "0");
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    } catch {
      return "";
    }
  };
  const toISO = (localDt) => {
    if (!localDt) return undefined;
    try {
      return new Date(localDt).toISOString();
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await listAllOrdersAdmin();
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
      <h2 className="mb-4 text-white">Órdenes</h2>
      {error ? <Alert variant="warning">{error}</Alert> : null}
      {diagnostico ? (
        <div className="mb-3">
          <p className="text-white-50">Fuente: {diagnostico.source} · Código: {diagnostico.code} · Estado: {diagnostico.status}</p>
          <p className="text-white-50">Detalle: {diagnostico.error}</p>
        </div>
      ) : null}
      {orders.length === 0 ? (
        <p className="text-white">No hay órdenes registradas.</p>
      ) : (
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Items</th>
              <th>Cliente</th>
              <th>Ciudad</th>
              <th>Acciones</th>
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
                <td>{o.destinatario || "-"}</td>
                <td>{o.ciudad || "-"}</td>
                <td>
                  {["ADMIN","VENDEDOR"].includes(userRole) ? (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => {
                        setEditing(o);
                        setForm({
                          status: String(o.status || "").toUpperCase(),
                          fechaPedido: toLocalDT(o.fechaPedido || o.createdAt),
                          destinatario: o.destinatario || "",
                          direccion: o.direccion || "",
                          region: o.region || "",
                          ciudad: o.ciudad || "",
                          codigoPostal: o.codigoPostal || "",
                        });
                        setResultMsg("");
                        setResultVariant("info");
                        setShowModal(true);
                      }}
                    >
                      Editar
                    </Button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Orden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resultMsg ? <Alert variant={resultVariant}>{resultMsg}</Alert> : null}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                disabled={String(editing?.status).toUpperCase() === "PAID" && !["PAID","CANCELLED"].includes(form.status)}
              >
                {allowedStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Pedido</Form.Label>
              <Form.Control
                type="datetime-local"
                value={form.fechaPedido}
                onChange={(e) => setForm((prev) => ({ ...prev, fechaPedido: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Destinatario</Form.Label>
              <Form.Control
                type="text"
                value={form.destinatario}
                onChange={(e) => setForm((prev) => ({ ...prev, destinatario: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={form.direccion}
                onChange={(e) => setForm((prev) => ({ ...prev, direccion: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Región</Form.Label>
              <Form.Control
                type="text"
                value={form.region}
                onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                value={form.ciudad}
                onChange={(e) => setForm((prev) => ({ ...prev, ciudad: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control
                type="text"
                value={form.codigoPostal}
                onChange={(e) => {
                  const v = String(e.target.value || "").replace(/\D/g, "").slice(0, 5);
                  setForm((prev) => ({ ...prev, codigoPostal: v }));
                }}
                inputMode="numeric"
                maxLength={5}
                pattern="\\d{5}"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button
            variant="primary"
            onClick={async () => {
              setResultMsg("");
              setResultVariant("info");
              if (!editing) return;
              const original = editing;
              const payload = {};
              const nextStatus = String(form.status || "").toUpperCase();
              if (nextStatus && nextStatus !== String(original.status || "").toUpperCase()) {
                if (String(original.status || "").toUpperCase() === "PAID" && !["PAID","CANCELLED"].includes(nextStatus)) {
                  setResultMsg("Cambio de estado no permitido");
                  setResultVariant("danger");
                  return;
                }
                if (!allowedStatuses.includes(nextStatus)) {
                  setResultMsg("Validación: estado inválido");
                  setResultVariant("warning");
                  return;
                }
                payload.status = nextStatus;
              }
              if (form.fechaPedido) {
                const iso = toISO(form.fechaPedido);
                if (iso && iso !== original.fechaPedido) payload.fechaPedido = iso;
              }
              if (form.destinatario && form.destinatario.trim() && form.destinatario !== (original.destinatario || "")) payload.destinatario = form.destinatario.trim();
              if (form.direccion && form.direccion.trim() && form.direccion !== (original.direccion || "")) payload.direccion = form.direccion.trim();
              if (form.region && form.region.trim() && form.region !== (original.region || "")) payload.region = form.region.trim();
              if (form.ciudad && form.ciudad.trim() && form.ciudad !== (original.ciudad || "")) payload.ciudad = form.ciudad.trim();
              if (form.codigoPostal && form.codigoPostal.trim() && form.codigoPostal !== (original.codigoPostal || "")) payload.codigoPostal = form.codigoPostal.trim();
              try {
                const updated = await updateOrderPartial(original.id, payload);
                setOrders((prev) => prev.map((o) => (String(o.id) === String(original.id) ? { ...o, ...updated } : o)));
                setResultMsg("Orden actualizada correctamente");
                setResultVariant("success");
              } catch (e) {
                const st = e?.status || 0;
                if (st === 401) {
                  setResultMsg("Unauthorized");
                  setResultVariant("danger");
                } else if (st === 422) {
                  const detail = e?.data?.details || e?.message || "Validación";
                  setResultMsg(String(detail));
                  setResultVariant("warning");
                } else if (st === 409) {
                  setResultMsg("Cambio de estado no permitido");
                  setResultVariant("danger");
                } else if (st === 403 || st === 404) {
                  setResultMsg("No puedes editar esta orden o no existe");
                  setResultVariant("danger");
                } else {
                  setResultMsg(e?.message || "Error de API");
                  setResultVariant("danger");
                }
              }
            }}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
