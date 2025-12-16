import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { getProductos, updateProducto, deleteProducto, createProducto } from "../services/productos";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [editProducto, setEditProducto] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProductos();
        setProductos(Array.isArray(data) ? data : []);
      } catch {
        setProductos([]);
      }
    })();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProducto(id);
      setProductos(productos.filter((p) => p.id !== id));
    } catch {
      // sin cambios si falla
    }
  };
  const handleEditProduct = (producto) => { setEditProducto(producto); setShowProductModal(true); };
  const submitProduct = async (payload) => {
    const url = String(payload.imagenurl || payload.imagen || "").replace(/[`]/g, "");
    const body = {
      nombre: payload.nombre,
      descripcion: payload.descripcion,
      tipo: payload.tipo,
      precio: Number(payload.precio),
      stock: Number(payload.stock),
      imagen: url,
      imagenUrl: url,
    };
    if (editProducto && editProducto.id) {
      const updated = await updateProducto(editProducto.id, body);
      setProductos((prev) => prev.map((p) => (p.id === editProducto.id ? updated : p)));
      setEditProducto(null);
      setShowProductModal(false);
    } else {
      const created = await createProducto(body);
      setProductos((prev) => [...prev, created]);
    }
  };

  return (
    <Container fluid className="py-5 text-white">
      <h2 className="text-center mb-4 fw-bold text-white">Admin — Productos</h2>
      <Row className="mb-5">
        <Col md={6} className="px-3">
          <ProductTable productos={productos} onDelete={handleDeleteProduct} onEdit={handleEditProduct} />
        </Col>
        <Col md={6} className="px-3">
          <ProductForm initial={null} onSubmit={submitProduct} />
        </Col>
      </Row>

      <Modal show={showProductModal} onHide={() => { setShowProductModal(false); setEditProducto(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm initial={editProducto} onSubmit={submitProduct} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowProductModal(false); setEditProducto(null); }}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

