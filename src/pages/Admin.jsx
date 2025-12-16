import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import { getProductos, updateProducto, deleteProducto, createProducto } from "../services/productos";
import { http } from "../services/http";
import { register as apiRegister } from "../services/auth";

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editProducto, setEditProducto] = useState(null);
  const [editUsuario, setEditUsuario] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Cargar datos iniciales (simulado con JSON o API)
  useEffect(() => {
    (async () => {
      try {
        const data = await getProductos();
        setProductos(Array.isArray(data) ? data : []);
      } catch {
        setProductos([]);
      }
    })();
    (async () => {
      try {
        const data = await http.get("/api/v1/users");
        const list = Array.isArray(data) ? data : (data?.content ?? []);
        setUsuarios(list);
      } catch {
        setUsuarios([]);
      }
    })();
  }, []);

  // Handlers productos
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

  // Handlers usuarios
  const handleAddUser = async (usuario) => {
    try {
      const created = await apiRegister({
        email: usuario.email,
        password: usuario.password,
        nombre: usuario.nombre,
        apellido: usuario.apellido || null,
        telefono: usuario.telefono || null,
        direccion: usuario.direccion || null,
        ciudad: usuario.ciudad || null,
        codigoPostal: usuario.codigoPostal || null,
        role: usuario.role || "USER",
      });
      setUsuarios((prev) => [...prev, created]);
    } catch (e) {
      void e;
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      await http.del(`/api/v1/users/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch {
      // sin cambios si falla
    }
  };
  const handleEditUser = (usuario) => { setEditUsuario(usuario); setShowUserModal(true); };
  const submitUser = async (payload) => {
    const id = editUsuario?.id || editUsuario?.user?.id;
    if (id) {
      const body = {
        email: payload.email,
        password: payload.password || undefined,
        nombre: payload.nombre,
        apellido: payload.apellido || null,
        telefono: payload.telefono || null,
        direccion: payload.direccion || null,
        ciudad: payload.ciudad || null,
        codigoPostal: payload.codigoPostal || null,
        role: payload.role || (editUsuario.role || editUsuario?.user?.role || "USER"),
      };
      const updated = await http.put(`/api/v1/users/${id}`, body);
      setUsuarios((prev) => prev.map((u) => ((u.id || u.user?.id) === id ? updated : u)));
      setEditUsuario(null);
      setShowUserModal(false);
    } else {
      await handleAddUser(payload);
    }
  };

  

  return (
    <Container fluid className="py-5 text-white">
      <h2 className="text-center mb-4 fw-bold text-white">Panel de Administración</h2>
      <p className="text-white text-center mb-4">
        Roles disponibles (API): <strong>ADMIN</strong>, <strong>USER_AD</strong>, <strong>PROD_AD</strong>, <strong>VENDEDOR</strong>, <strong>CLIENT</strong> (alias <strong>USER</strong>)
      </p>

      {/* Productos */}
      <Row className="mb-5">
        <Col md={6} className="px-3">
          <ProductTable productos={productos} onDelete={handleDeleteProduct} onEdit={handleEditProduct} />
        </Col>
        <Col md={6} className="px-3">
          <ProductForm initial={null} onSubmit={submitProduct} />
        </Col>
      </Row>

      {/* Usuarios */}
      <Row className="mb-5">
        <Col md={6} className="px-3">
          <UserTable usuarios={usuarios} onDelete={handleDeleteUser} onEdit={handleEditUser} />
        </Col>
        <Col md={6} className="px-3">
          <UserForm initial={null} onSubmit={submitUser} />
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

      <Modal show={showUserModal} onHide={() => { setShowUserModal(false); setEditUsuario(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm initial={editUsuario} onSubmit={submitUser} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowUserModal(false); setEditUsuario(null); }}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
