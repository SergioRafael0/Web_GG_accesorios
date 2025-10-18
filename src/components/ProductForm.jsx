import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

export default function ProductForm({ onAddProduct }) {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    descripcion: "",
    imagen: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.precio) return;
    onAddProduct({ ...formData, id: Date.now() });
    setFormData({ nombre: "", precio: "", categoria: "", descripcion: "", imagen: "" });
  };

  return (
    <Card className="bg-dark text-white border-secondary mb-4">
      <Card.Body>
        <h4 className="mb-3">Agregar Producto</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Teclado RGB"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              placeholder="Ej: 49990"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Ej: periféricos"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL Imagen</Form.Label>
            <Form.Control
              type="text"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="/images/..."
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">
            Guardar Producto
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
