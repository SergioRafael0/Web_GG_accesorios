import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import { getProductos } from "../services/productos";

function groupByCategory(items) {
  return items.reduce((acc, p) => {
    const key = p.tipo || "sin-categoria";
    (acc[key] = acc[key] || []).push(p);
    return acc;
  }, {});
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductos();
        if (!Array.isArray(data)) {
          const e = new Error("Formato inesperado: la API no devolvió un arreglo");
          e.code = "BAD_FORMAT";
          e.status = 200;
          throw e;
        }
        if (mounted) {
          setProductos(data);
        }
      } catch (err) {
        if (mounted) {
          setProductos([]);
          setError({
            message: err?.message || "No se pudo cargar el catálogo",
            status: typeof err?.status === "number" ? err.status : 0,
            code: err?.code || "UNKNOWN",
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const categorias = Array.from(new Set(productos.map((p) => p.tipo || "sin-categoria")));
  const byCat = groupByCategory(productos);

  const filtered = productos.filter((p) => {
    const matchQuery =
      query.trim() === "" ||
      p.nombre.toLowerCase().includes(query.toLowerCase()) ||
      (p.descripcion || "").toLowerCase().includes(query.toLowerCase());
    const matchCat = categoria === "all" || (p.tipo || "") === categoria;
    return matchQuery && matchCat;
  });

  if (loading) {
    return (
      <Container className="py-5">
        <h2 className="mb-4">Catálogo de Productos</h2>
        <p className="text-muted">Cargando catálogo...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <h2 className="mb-4">Catálogo de Productos</h2>
        <div className="mb-3">
          <p className="text-danger mb-1">No se pudo cargar el catálogo</p>
          <small className="text-muted">Detalle: {error.message}</small>
          <div className="mt-2">
            <small className="text-muted">Código: {error.code} · Estado: {error.status}</small>
          </div>
        </div>
        <div className="mb-3">
          <strong>Diagnóstico:</strong>
          <ul>
            <li>API caída o latencia alta</li>
            <li>CORS deshabilitado o bloqueado</li>
            <li>URL base incorrecta</li>
            <li>Formato inesperado del endpoint</li>
          </ul>
        </div>
        <Button variant="secondary" onClick={() => window.location.reload()}>Reintentar</Button>
      </Container>
    );
  }

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
          <small className="text-muted">{filtered.length} Productos</small>
        </Col>
      </Row>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <Col key={p.id}>
              <ProductCard {...p} />
            </Col>
          ))
        ) : productos.length > 0 ? (
          <Col>
            <p className="text-muted">No hay coincidencias con el filtro actual</p>
          </Col>
        ) : (
          <Col>
            <p className="text-muted">No hay productos disponibles</p>
          </Col>
        )}
      </Row>

      <section className="container py-4">
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
      </section>
    </Container>
  );
}
