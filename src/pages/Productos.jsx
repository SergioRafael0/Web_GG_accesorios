import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import ProductCard from "../components/ProductCard";

function groupByCategory(items) {
  return items.reduce((acc, p) => {
    (acc[p.categoria] = acc[p.categoria] || []).push(p);
    return acc;
  }, {});
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("all");

  useEffect(() => {
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error cargando productos:", err);
        setProductos([]);
      });
  }, []);

  // obtener categorías dinámicamente
  const categorias = Array.from(new Set(productos.map((p) => p.categoria || "sin-categoria")));
  const byCat = groupByCategory(productos);

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

      <main className="container py-4">
        <h2>Todos los productos</h2>
        {Object.keys(byCat).map((cat) => (
          <section key={cat} id={cat} className="products-category">
            <h3>{cat}</h3>
            <div className="product-grid">
              {byCat[cat].map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
