import { http } from "./http";

function safeLocalGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function safeLocalSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    void 0;
  }
}

export async function checkoutCreate(payload) {
  try {
    return await http.post("/api/v1/checkout", payload);
  } catch (e) {
    const id = String(Date.now());
    const nowIso = new Date().toISOString();
    const draft = (() => {
      try {
        const raw = localStorage.getItem("pendingOrder");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();
    const order = {
      id,
      status: "PENDING",
      total: draft?.total ?? payload?.total ?? 0,
      items: draft?.items ?? payload?.items ?? [],
      destinatario: payload?.destinatario,
      direccion: payload?.direccion,
      region: payload?.region,
      ciudad: payload?.ciudad,
      codigoPostal: payload?.codigoPostal || "00000",
      metodoEnvio: payload?.metodoEnvio ?? (draft?.envio || null),
      metodoPago: payload?.metodoPago ?? (draft?.pago || null),
      fechaPedido: payload?.fechaPedido || nowIso,
      createdAt: nowIso,
      _fallback: true,
      _source: "local",
      _code: e?.code || "NETWORK_ERROR",
      _status: typeof e?.status === "number" ? e.status : 0,
      _error: e?.message || "Fallo de red o CORS",
    };
    const orders = safeLocalGet("orders", []);
    safeLocalSet("orders", [...orders, order]);
    return order;
  }
}

export async function checkoutConfirm(ordenId, referenciaPago) {
  try {
    return await http.post(`/api/v1/checkout/${ordenId}/confirm`, { referenciaPago });
  } catch (e) {
    const compra = {
      id: String(Date.now()),
      ordenId,
      estado: "PAID",
      referenciaPago,
      _fallback: true,
      _source: "local",
      _code: e?.code || "NETWORK_ERROR",
      _status: typeof e?.status === "number" ? e.status : 0,
      _error: e?.message || "Fallo de red o CORS",
    };
    const orders = safeLocalGet("orders", []);
    const idx = orders.findIndex((o) => String(o.id) === String(ordenId));
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], status: "PAID" };
      safeLocalSet("orders", orders);
    }
    return compra;
  }
}

export async function getOrderById(id) {
  try {
    return await http.get(`/api/v1/orders/${id}`);
  } catch (e) {
    const orders = safeLocalGet("orders", []);
    const found = orders.find((o) => String(o.id) === String(id)) || null;
    if (!found) return null;
    return {
      ...found,
      _fallback: true,
      _source: "local",
      _code: e?.code || "NETWORK_ERROR",
      _status: typeof e?.status === "number" ? e.status : 0,
      _error: e?.message || "Fallo de red o CORS",
    };
  }
}

export async function listMyOrders() {
  try {
    return await http.get("/api/v1/orders");
  } catch (e) {
    const items = safeLocalGet("orders", []);
    return {
      items,
      source: "local",
      code: e?.code || "NETWORK_ERROR",
      status: typeof e?.status === "number" ? e.status : 0,
      error: e?.message || "Fallo de red o CORS",
    };
  }
}

export async function listAllOrdersAdmin() {
  try {
    return await http.get("/api/v1/orders/admin");
  } catch (e) {
    const items = safeLocalGet("orders", []);
    return {
      items,
      source: "local",
      code: e?.code || "NETWORK_ERROR",
      status: typeof e?.status === "number" ? e.status : 0,
      error: e?.message || "Fallo de red o CORS",
    };
  }
}

export async function updateOrderStatus(id, status) {
  try {
    return await http.patch(`/api/v1/orders/${id}`, { status });
  } catch (e) {
    const orders = safeLocalGet("orders", []);
    const idx = orders.findIndex((o) => String(o.id) === String(id));
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], status };
      safeLocalSet("orders", orders);
      return {
        ...orders[idx],
        _fallback: true,
        _source: "local",
        _code: e?.code || "NETWORK_ERROR",
        _status: typeof e?.status === "number" ? e.status : 0,
        _error: e?.message || "Fallo de red o CORS",
      };
    }
    return null;
  }
}

export async function updateOrderPartial(id, partial) {
  try {
    return await http.patch(`/api/v1/orders/${id}`, partial);
  } catch (e) {
    const msg = String(e?.message || "");
    const unsupported = (e?.status === 405) || msg.includes("PATCH") || msg.includes("not supported");
    if (unsupported) {
      try {
        return await http.put(`/api/v1/orders/${id}`, partial);
      } catch (e2) {
        const error = new Error(e2?.message || "Error de API");
        error.status = typeof e2?.status === "number" ? e2.status : 0;
        error.code = e2?.code || "HTTP_ERROR";
        error.data = e2?.data;
        throw error;
      }
    }
    const error = new Error(e?.message || "Error de API");
    error.status = typeof e?.status === "number" ? e.status : 0;
    error.code = e?.code || "HTTP_ERROR";
    error.data = e?.data;
    throw error;
  }
}
