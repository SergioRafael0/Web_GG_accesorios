import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { validarRequerido, validarCorreo, validarPassword } from "../utils/validaciones";

export default function UserForm({ onAddUser }) {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validarRequerido(form.nombre)) newErrors.nombre = "Nombre obligatorio";
    if (!validarRequerido(form.email)) newErrors.email = "Email obligatorio";
    else if (!validarCorreo(form.email)) newErrors.email = "Email inválido";

    if (!validarRequerido(form.password)) newErrors.password = "Contraseña obligatoria";
    else if (!validarPassword(form.password))
      newErrors.password = "Debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo";

    setErrores(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const usuario = { id: Date.now(), nombre: form.nombre, email: form.email, password: form.password };
      onAddUser(usuario);
      setForm({ nombre: "", email: "", password: "" });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          isInvalid={!!errores.nombre}
        />
        <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          isInvalid={!!errores.email}
        />
        <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          isInvalid={!!errores.password}
        />
        <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" className="w-100 btn-warning">
        Guardar
      </Button>
    </Form>
  );
}
