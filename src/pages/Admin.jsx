import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import EventForm from "../components/EventForm";
import EventTable from "../components/EventTable";

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [eventos, setEventos] = useState([]);

  // Cargar datos iniciales (simulado con JSON o API)
  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error(err));

    fetch("/data/users.json")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error(err));

    fetch("/data/events.json")
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error(err));
  }, []);

  // Handlers productos
  const handleAddProduct = (producto) => setProductos([...productos, producto]);
  const handleDeleteProduct = (id) => setProductos(productos.filter((p) => p.id !== id));

  // Handlers usuarios
  const handleAddUser = (usuario) => setUsuarios([...usuarios, usuario]);
  const handleDeleteUser = (id) => setUsuarios(usuarios.filter((u) => u.id !== id));

  // Handlers eventos
  const handleAddEvent = (evento) => setEventos([...eventos, evento]);
  const handleDeleteEvent = (id) => setEventos(eventos.filter((e) => e.id !== id));

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 fw-bold text-white">Panel de Administración</h2>

      {/* Productos */}
      <Row className="mb-5">
        <Col md={6}>
          <ProductTable productos={productos} onDelete={handleDeleteProduct} />
        </Col>
        <Col md={6}>
          <ProductForm onAddProduct={handleAddProduct} />
        </Col>
      </Row>

      {/* Usuarios */}
      <Row className="mb-5">
        <Col md={6}>
          <UserTable usuarios={usuarios} onDelete={handleDeleteUser} />
        </Col>
        <Col md={6}>
          <UserForm onAddUser={handleAddUser} />
        </Col>
      </Row>

      {/* Eventos */}
      <Row>
        <Col md={6}>
          <EventTable eventos={eventos} onDelete={handleDeleteEvent} />
        </Col>
        <Col md={6}>
          <EventForm onAddEvent={handleAddEvent} />
        </Col>
      </Row>
    </Container>
  );
}
