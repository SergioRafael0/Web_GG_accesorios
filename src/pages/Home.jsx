import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <div className="text-white">
      {/* Hero Carousel */}
      <Carousel fade className="mb-5">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/banner1.jpg"
            alt="Ofertas gaming"
            style={{ maxHeight: "480px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 className="fw-bold text-shadow">Ofertas Gamer</h3>
            <p>Equipos de alto rendimiento a precios increíbles.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/banner2.jpg"
            alt="Nuevos productos"
            style={{ maxHeight: "480px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 className="fw-bold text-shadow">Nuevos Lanzamientos</h3>
            <p>Descubre los últimos periféricos para tu setup.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

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
