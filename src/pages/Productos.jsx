import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import ProductCard from "../components/ProductCard";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("all");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Si colocaste products.json en /public/data/products.json usa fetch('/data/products.json')
    fetch("/data/productos.json")
      .then((r) => r.json())
      .then((data) => {
        setProductos(data);
        // extraer categorías únicas
        const cats = Array.from(new Set(data.map((p) => p.categoria || "sin-categoria")));
        setCategorias(cats);
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  const filtered = productos.filter((p) => {
    const matchQuery =
      query.trim() === "" ||
      p.nombre.toLowerCase().includes(query.toLowerCase()) ||
      (p.descripcion || "").toLowerCase().includes(query.toLowerCase());
    const matchCat = categoria === "all" || (p.categoria || "") === categoria;
    return matchQuery && matchCat;
  });

  return (
    <Container className="py-5">
      <h2 className="mb-4">Catálogo de Productos</h2>

      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar producto por nombre o descripción..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="secondary" onClick={() => setQuery("")}>
              Limpiar
            </Button>
          </InputGroup>
        </Col>

        <Col md={3}>
          <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="all">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={3} className="text-md-end mt-2 mt-md-0">
          <small className="text-muted">{filtered.length} productos</small>
        </Col>
      </Row>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <Col key={p.id}>
              <ProductCard {...p} />
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-muted">No se encontraron productos.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
