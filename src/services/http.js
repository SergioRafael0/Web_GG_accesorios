const BASE_URL = import.meta.env.VITE_API_URL || "https://apitest-1-95ny.onrender.com";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const isFormData = options.body && typeof FormData !== "undefined" && options.body instanceof FormData;
  const defaultHeaders = isFormData ? {} : { "Content-Type": "application/json" };
  const headers = { ...defaultHeaders, ...(options.headers || {}) };
  const method = (options.method || "GET").toUpperCase();
  const isPublic = (
    (path.startsWith("/api/v1/productos") && method === "GET")
    || path.startsWith("/api/v1/imagenes")
    || path.startsWith("/api/v1/auth/")
  );
  if (token && !isPublic) headers["Authorization"] = `Bearer ${token}`;
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
    });
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await res.json() : await res.text();
    if (!res.ok) {
      const message = typeof data === "string" ? data : data?.message || "Error de API";
      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      error.code = "HTTP_ERROR";
      throw error;
    }
    return data;
  } catch (e) {
    if (e && e.status) throw e;
    const error = new Error("Fallo de red o CORS");
    error.status = 0;
    error.code = "NETWORK_ERROR";
    error.data = { cause: String(e && e.message ? e.message : e) };
    throw error;
  }
}

export const http = {
  baseUrl: BASE_URL,
  get: (path) => request(path),
  post: (path, body, headers) => request(path, { method: "POST", body, headers }),
  put: (path, body, headers) => request(path, { method: "PUT", body, headers }),
  patch: (path, body, headers) => request(path, { method: "PATCH", body, headers }),
  del: (path, headers) => request(path, { method: "DELETE", headers }),
};

