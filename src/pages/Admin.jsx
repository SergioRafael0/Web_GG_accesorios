import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";

export default function Admin() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddProduct = (producto) => {
    setProductos([...productos, producto]);
  };

  const handleDeleteProduct = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  return (
    <Container className="py-5 text-white">
      <h2 className="text-center mb-4 fw-bold">Panel de Administración</h2>
      <ProductForm onAddProduct={handleAddProduct} />
      <ProductTable productos={productos} onDelete={handleDeleteProduct} />
    </Container>
  );
}
