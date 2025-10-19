import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { validarRequerido } from "../utils/validaciones";

export default function ProductForm({ onAddProduct }) {
  const [form, setForm] = useState({ nombre: "", precio: "" });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validarRequerido(form.nombre)) newErrors.nombre = "Nombre obligatorio";
    if (!validarRequerido(form.precio)) newErrors.precio = "Precio obligatorio";
    setErrores(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const producto = { id: Date.now(), nombre: form.nombre, precio: Number(form.precio) };
      onAddProduct(producto);
      setForm({ nombre: "", precio: "" });
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
        <Form.Label>Precio</Form.Label>
        <Form.Control
          type="number"
          name="precio"
          value={form.precio}
          onChange={handleChange}
          isInvalid={!!errores.precio}
        />
        <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" className="w-100 btn-primary">
        Guardar
      </Button>
    </Form>
  );
}
