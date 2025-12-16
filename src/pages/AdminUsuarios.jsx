import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button, Alert, Toast, ToastContainer, Spinner } from "react-bootstrap";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import { http } from "../services/http";
import { register as apiRegister } from "../services/auth";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editUsuario, setEditUsuario] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [feedback, setFeedback] = useState({ msg: "", variant: "info" });
  const [editFeedback, setEditFeedback] = useState({ msg: "", variant: "info" });
  const [toastShow, setToastShow] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
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

  const handleAddUser = async (usuario) => {
    try {
      setFeedback({ msg: "", variant: "info" });
      const created = await apiRegister({
        email: usuario.email,
        password: usuario.password,
        nombre: usuario.nombre,
        apellido: usuario.apellido || null,
        telefono: usuario.telefono || null,
        direccion: usuario.direccion || null,
        region: usuario.region || null,
        ciudad: usuario.ciudad || null,
        codigoPostal: usuario.codigoPostal || null,
        role: usuario.role || "USER",
      });
      setUsuarios((prev) => [...prev, created]);
      setFeedback({ msg: "Usuario creado correctamente", variant: "success" });
    } catch (e) {
      const st = e?.status || 0;
      if (st === 401) setFeedback({ msg: "Unauthorized", variant: "danger" });
      else if (st === 422) setFeedback({ msg: String(e?.data?.details || "Validación"), variant: "warning" });
      else setFeedback({ msg: e?.message || "No se pudo crear el usuario", variant: "danger" });
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
      const initial = editUsuario || {};
      const currentRole = initial.role || initial?.user?.role || "CLIENT";
      let desiredRole = payload.role || currentRole;
      if (desiredRole === "USER") desiredRole = "CLIENT";
      const normalize = (v) => (v === undefined || v === null ? "" : String(v));
      const changes = {};
      if (normalize(payload.email) !== normalize(initial.email || initial?.user?.email)) changes.email = payload.email;
      if (normalize(desiredRole) !== normalize(currentRole)) changes.role = desiredRole;
      if (normalize(payload.nombre) !== normalize(initial?.profile?.nombre || initial.nombre)) changes.nombre = payload.nombre;
      if (normalize(payload.apellido) !== normalize(initial?.profile?.apellido || initial.apellido)) changes.apellido = payload.apellido || null;
      if (normalize(payload.telefono) !== normalize(initial?.profile?.telefono || initial.telefono)) changes.telefono = payload.telefono || null;
      if (normalize(payload.direccion) !== normalize(initial?.profile?.direccion || initial.direccion)) changes.direccion = payload.direccion || null;
      if (normalize(payload.region) !== normalize(initial?.profile?.region || initial.region)) changes.region = payload.region || null;
      if (normalize(payload.ciudad) !== normalize(initial?.profile?.ciudad || initial.ciudad)) changes.ciudad = payload.ciudad || null;
      if (normalize(payload.codigoPostal) !== normalize(initial?.profile?.codigoPostal || initial.codigoPostal)) changes.codigoPostal = payload.codigoPostal || null;
      setLoadingEdit(true);
      setEditFeedback({ msg: "Guardando...", variant: "info" });
      const token = localStorage.getItem("token") || "";
      async function patchUser(uid, changeSet, tkn) {
        const res = await fetch(`${http.baseUrl}/api/v1/users/${uid}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${tkn}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changeSet),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const message = data?.message || `Error ${res.status}`;
          const err = new Error(message);
          err.status = res.status;
          err.data = data;
          throw err;
        }
        return data;
      }
      try {
        await patchUser(id, changes, token);
        setToastMsg("Usuario actualizado");
        setToastShow(true);
        const data = await http.get("/api/v1/users");
        const list = Array.isArray(data) ? data : (data?.content ?? []);
        setUsuarios(list);
        setEditFeedback({ msg: "Usuario actualizado correctamente", variant: "success" });
        setTimeout(() => {
          setEditUsuario(null);
          setShowUserModal(false);
          setEditFeedback({ msg: "", variant: "info" });
        }, 600);
      } catch (e) {
        const st = e?.status || 0;
        if (st === 401) setEditFeedback({ msg: "Unauthorized", variant: "danger" });
        else if (st === 400 || st === 422) setEditFeedback({ msg: String(e?.data?.details || e?.message || "Validación"), variant: "warning" });
        else if (st === 403 || st === 404) setEditFeedback({ msg: "No puedes editar este usuario o no existe", variant: "danger" });
        else setEditFeedback({ msg: e?.message || "Error de API", variant: "danger" });
      } finally {
        setLoadingEdit(false);
      }
    } else {
      await handleAddUser(payload);
    }
  };

  return (
    <Container fluid className="py-5 text-white">
      <h2 className="text-center mb-4 fw-bold text-white">Admin — Usuarios</h2>
      <Row className="mb-5">
        <Col md={6} className="px-3">
          <UserTable usuarios={usuarios} onDelete={handleDeleteUser} onEdit={handleEditUser} />
        </Col>
        <Col md={6} className="px-3">
          {feedback.msg ? <Alert variant={feedback.variant}>{feedback.msg}</Alert> : null}
          <UserForm initial={null} onSubmit={submitUser} />
        </Col>
      </Row>

      <Modal show={showUserModal} onHide={() => { setShowUserModal(false); setEditUsuario(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editFeedback.msg ? <Alert variant={editFeedback.variant}>{editFeedback.msg}</Alert> : null}
          <UserForm initial={editUsuario} onSubmit={submitUser} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowUserModal(false); setEditUsuario(null); }} disabled={loadingEdit}>Cerrar</Button>
          {loadingEdit ? <Spinner animation="border" size="sm" /> : null}
        </Modal.Footer>
      </Modal>
      <ToastContainer position="bottom-end" className="p-3">
        <Toast onClose={() => setToastShow(false)} show={toastShow} delay={2000} autohide bg="success">
          <Toast.Header>
            <strong className="me-auto">Acción</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
