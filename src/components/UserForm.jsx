import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { validarRequerido, validarCorreo, validarPassword } from "../utils/validaciones";
import regionesComunas from "../data/ComunasRegiones.json";

export default function UserForm({ onSubmit, initial }) {
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "", telefono: "", direccion: "", region: "", ciudad: "", codigoPostal: "", role: "USER" });
  const [errores, setErrores] = useState({});
  useEffect(() => {
    if (initial) {
      setForm({
        nombre: initial?.profile?.nombre || initial?.nombre || "",
        apellido: initial?.profile?.apellido || initial?.apellido || "",
        email: initial?.email || initial?.user?.email || "",
        password: "",
        telefono: initial?.profile?.telefono || initial?.telefono || "",
        direccion: initial?.profile?.direccion || initial?.direccion || "",
        region: initial?.profile?.region || initial?.region || "",
        ciudad: initial?.profile?.ciudad || initial?.ciudad || "",
        codigoPostal: initial?.profile?.codigoPostal || initial?.codigoPostal || "",
        role: initial?.role || initial?.user?.role || "USER",
      });
    } else {
      setForm({ nombre: "", apellido: "", email: "", password: "", telefono: "", direccion: "", region: "", ciudad: "", codigoPostal: "", role: "USER" });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "region") {
      setForm((prev) => ({ ...prev, region: value, ciudad: "" }));
    } else if (name === "codigoPostal") {
      const v = String(value || "").replace(/\D/g, "").slice(0, 5);
      setForm((prev) => ({ ...prev, codigoPostal: v }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validarRequerido(form.nombre)) newErrors.nombre = "Nombre obligatorio";
    if (!validarRequerido(form.email)) newErrors.email = "Email obligatorio";
    else if (!validarCorreo(form.email)) newErrors.email = "Email inválido";

    if (!initial) {
      if (!validarRequerido(form.password)) newErrors.password = "Contraseña obligatoria";
      else if (!validarPassword(form.password)) newErrors.password = "Debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo";
    }

    setErrores(newErrors);

    if (Object.keys(newErrors).length === 0) {
      (async () => {
        try {
          const payload = {
            email: form.email,
            password: form.password || undefined,
            nombre: form.nombre,
            apellido: form.apellido || null,
            telefono: form.telefono || null,
            direccion: form.direccion || null,
            region: form.region || null,
            ciudad: form.ciudad || null,
            codigoPostal: form.codigoPostal || null,
            role: form.role || "USER",
          };
          await onSubmit(payload);
          setForm({ nombre: "", apellido: "", email: "", password: "", telefono: "", direccion: "", region: "", ciudad: "", codigoPostal: "", role: "USER" });
        } catch {
          setErrores({ general: "No se pudo guardar el usuario" });
        }
      })();
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
        <Form.Label>Apellido</Form.Label>
        <Form.Control type="text" name="apellido" value={form.apellido} onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" value={form.email} onChange={handleChange} isInvalid={!!errores.email} />
        <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" name="password" value={form.password} onChange={handleChange} isInvalid={!!errores.password} />
        <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control type="text" name="telefono" value={form.telefono} onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Dirección</Form.Label>
        <Form.Control type="text" name="direccion" value={form.direccion} onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Región</Form.Label>
        <Form.Select name="region" value={form.region} onChange={handleChange}>
          <option value="">Seleccione una región</option>
          {regionesComunas.map((r) => (
            <option key={r.region} value={r.region}>{r.region}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Comuna</Form.Label>
        <Form.Select name="ciudad" value={form.ciudad} onChange={handleChange} disabled={!form.region}>
          <option value="">Seleccione una comuna</option>
          {form.region && regionesComunas.find((r) => r.region === form.region)?.comunas.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Código Postal</Form.Label>
        <Form.Control type="text" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} inputMode="numeric" maxLength={5} pattern="\\d{5}" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Rol</Form.Label>
        <Form.Select name="role" value={form.role} onChange={handleChange}>
          <option value="ADMIN">ADMIN</option>
          <option value="USER_AD">USER_AD</option>
          <option value="PROD_AD">PROD_AD</option>
          <option value="VENDEDOR">VENDEDOR</option>
          <option value="CLIENT">CLIENT</option>
          <option value="USER">USER</option>
        </Form.Select>
      </Form.Group>

      <Button type="submit" className="w-100 btn-warning">
        Guardar
      </Button>
      {errores.general && <div className="error mt-2">{errores.general}</div>}
    </Form>
  );
}
