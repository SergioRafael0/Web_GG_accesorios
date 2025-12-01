import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
// import { http } from "../services/http";
import { validarRequerido } from "../utils/validaciones";

export default function ProductForm({ onSubmit, initial }) {
  const [form, setForm] = useState({ nombre: "", descripcion: "", tipo: "", precio: "", stock: "", imagenurl: "" });
  const [errores, setErrores] = useState({});
  const [uploadMsg, setUploadMsg] = useState("");
  useEffect(() => {
    if (initial) {
      setForm({
        nombre: initial.nombre || "",
        descripcion: initial.descripcion || "",
        tipo: initial.tipo || "",
        precio: String(initial.precio ?? ""),
        stock: String(initial.stock ?? ""),
        imagenurl: String(initial.imagen ?? initial.imagenUrl ?? ""),
      });
    } else {
      setForm({ nombre: "", descripcion: "", tipo: "", precio: "", stock: "", imagenurl: "" });
    }
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validarRequerido(form.nombre)) newErrors.nombre = "Nombre obligatorio";
    if (!validarRequerido(form.descripcion)) newErrors.descripcion = "Descripción obligatoria";
    if (!validarRequerido(form.tipo)) newErrors.tipo = "Tipo obligatorio";
    if (!validarRequerido(form.precio)) newErrors.precio = "Precio obligatorio";
    if (!validarRequerido(form.stock)) newErrors.stock = "Stock obligatorio";
    if (!validarRequerido(form.imagenurl)) newErrors.imagenurl = "Imagen obligatoria";
    setErrores(newErrors);

    if (Object.keys(newErrors).length === 0) {
      (async () => {
        try {
          const imagenClean = String(form.imagenurl).replace(/[`]/g, "");
          await onSubmit({
            nombre: form.nombre,
            descripcion: form.descripcion,
            tipo: form.tipo,
            precio: Number(form.precio),
            imagen: imagenClean,
            stock: Number(form.stock),
          });
          setForm({ nombre: "", descripcion: "", tipo: "", precio: "", stock: "", imagenurl: "" });
        } catch {
          setErrores({ general: "No se pudo guardar el producto" });
        }
      })();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      setUploadMsg("Imagen seleccionada");
      const fd = new FormData();
      fd.append("imagen", file);
      setUploadMsg("Subiendo a Cloudinary...");
      const resp = await fetch("https://apitest-1-95ny.onrender.com/imagenes", { method: "POST", body: fd });
      const ct = resp.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await resp.json() : await resp.text();
      if (!resp.ok) {
        setUploadMsg("");
        setErrores((prev) => ({ ...prev, imagenurl: (typeof data === "string" ? data : (data?.message || "Error al subir la imagen")) }));
        return;
      }
      const url = typeof data === "string" ? data : (data?.url || data?.secure_url || data?.imagen || "");
      if (url) {
        const prevUrl = form.imagenurl;
        setUploadMsg(`URL recibida: ${url}`);
        setForm((prev) => ({ ...prev, imagenurl: url }));
        setUploadMsg(prevUrl ? "URL cargada y reemplazada la anterior" : "URL cargada");
      } else {
        setUploadMsg("");
        setErrores((prev) => ({ ...prev, imagenurl: "Respuesta sin URL" }));
      }
    } catch {
      setUploadMsg("");
      setErrores((prev) => ({ ...prev, imagenurl: "No se pudo subir la imagen" }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2">
        <Form.Label>Nombre</Form.Label>
        <Form.Control type="text" name="nombre" value={form.nombre} onChange={handleChange} isInvalid={!!errores.nombre} />
        <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Descripción</Form.Label>
        <Form.Control as="textarea" rows={2} name="descripcion" value={form.descripcion} onChange={handleChange} isInvalid={!!errores.descripcion} />
        <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Tipo</Form.Label>
        <Form.Control type="text" name="tipo" value={form.tipo} onChange={handleChange} isInvalid={!!errores.tipo} />
        <Form.Control.Feedback type="invalid">{errores.tipo}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Precio</Form.Label>
        <Form.Control type="number" name="precio" value={form.precio} onChange={handleChange} isInvalid={!!errores.precio} />
        <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Stock</Form.Label>
        <Form.Control type="number" name="stock" value={form.stock} onChange={handleChange} isInvalid={!!errores.stock} />
        <Form.Control.Feedback type="invalid">{errores.stock}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Imagen URL</Form.Label>
        <Form.Control type="text" placeholder="URL de imagen" name="imagenurl" value={form.imagenurl} onChange={handleChange} isInvalid={!!errores.imagenurl} />
        <Form.Control.Feedback type="invalid">{errores.imagenurl}</Form.Control.Feedback>
        <div className="d-flex align-items-center mt-2 gap-2">
          <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
          {form.imagenurl ? (
            <img src={String(form.imagenurl).replace(/[`]/g, "")} alt="preview" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />
          ) : null}
        </div>
        {uploadMsg ? <div className="form-success mt-2">{uploadMsg}</div> : null}
        {form.imagenurl ? (
          <div className="mt-2">
            <Form.Label>URL actual</Form.Label>
            <Form.Control readOnly value={String(form.imagenurl).replace(/[`]/g, "")} />
          </div>
        ) : null}
      </Form.Group>

      <Button type="submit" className="w-100 btn-primary">
        Guardar
      </Button>
      {errores.general && <div className="error mt-2">{errores.general}</div>}
    </Form>
  );
}
