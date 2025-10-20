import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { validarRequerido } from "../utils/validaciones";

export default function EventForm({ onAddEvent }) {
  const [form, setForm] = useState({ tipo: "primary", nombre: "", fecha: "" });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validarRequerido(form.nombre)) newErrors.nombre = "Nombre obligatorio";
    if (!validarRequerido(form.fecha)) newErrors.fecha = "Fecha obligatoria";

    setErrores(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const evento = { id: Date.now(), tipo: form.tipo, nombre: form.nombre, fecha: form.fecha };
      onAddEvent(evento);
      setForm({ tipo: "primary", nombre: "", fecha: "" });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2">
        <Form.Label>Tipo</Form.Label>
        <Form.Select name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="primary">Reunión</option>
          <option value="success">Lanzamiento</option>
          <option value="info">Capacitación</option>
          <option value="danger">Inventario</option>
          <option value="warning">Auditoría</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Nombre del Evento</Form.Label>
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
        <Form.Label>Fecha</Form.Label>
        <Form.Control
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          isInvalid={!!errores.fecha}
        />
        <Form.Control.Feedback type="invalid">{errores.fecha}</Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" className="w-100 btn-success">
        Agregar
      </Button>
    </Form>
  );
}
