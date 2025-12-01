const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "/api" : "http://localhost:8080");

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const message = typeof data === "string" ? data : data?.message || "Error de API";
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const http = {
  baseUrl: BASE_URL,
  get: (path) => request(path),
  post: (path, body, headers) => request(path, { method: "POST", body, headers }),
  put: (path, body, headers) => request(path, { method: "PUT", body, headers }),
  patch: (path, body, headers) => request(path, { method: "PATCH", body, headers }),
  del: (path, headers) => request(path, { method: "DELETE", headers }),
};

