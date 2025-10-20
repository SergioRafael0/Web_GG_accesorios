import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <div className="text-white">
      {/* Productos */}
      <Container className="pb-5">
        <h2 className="text-center mb-4 fw-bold">Productos Destacados</h2>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {productos.map((producto) => (
            <Col key={producto.id}>
              <ProductCard {...producto} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
