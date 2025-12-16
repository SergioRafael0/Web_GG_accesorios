import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import regionesComunas from "../data/ComunasRegiones.json";
import { me as apiMe, updateMe as apiUpdateMe } from "../services/auth";

export default function Perfil() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    region: "",
    ciudad: "",
    codigoPostal: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await apiMe();
        const profile = me?.profile || {};
        setForm({
          nombre: profile.nombre || "",
          apellido: profile.apellido || "",
          telefono: profile.telefono || "",
          direccion: profile.direccion || "",
          region: profile.region || "",
          ciudad: profile.ciudad || "",
          codigoPostal: profile.codigoPostal || "",
          email: me?.email || "",
        });
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "codigoPostal") {
      const v = String(value || "").replace(/\D/g, "").slice(0, 5);
      setForm((prev) => ({ ...prev, codigoPostal: v }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    (async () => {
      try {
        const payload = {
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          direccion: form.direccion,
          region: form.region,
          ciudad: form.ciudad,
          codigoPostal: form.codigoPostal,
        };
        await apiUpdateMe(payload);
        setSaveMsg("Perfil actualizado correctamente");
      } catch {
        setSaveMsg("No se pudo actualizar el perfil");
      } finally {
        setSaving(false);
      }
    })();
  };

  return (
    <Container className="py-5 text-white">
      <h2 className="mb-4 text-white">Mi Perfil</h2>

      <Form onSubmit={handleSave} className="mb-5">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="text-white">Email</Form.Label>
              <Form.Control type="email" value={form.email} disabled className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label className="text-white">Nombre</Form.Label>
              <Form.Control name="nombre" value={form.nombre} onChange={handleChange} className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="apellido">
              <Form.Label className="text-white">Apellido</Form.Label>
              <Form.Control name="apellido" value={form.apellido} onChange={handleChange} className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label className="text-white">Teléfono</Form.Label>
              <Form.Control name="telefono" value={form.telefono} onChange={handleChange} className="bg-dark text-white border-secondary" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="direccion">
              <Form.Label className="text-white">Dirección</Form.Label>
              <Form.Control name="direccion" value={form.direccion} onChange={handleChange} className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="region">
              <Form.Label className="text-white">Región</Form.Label>
              <Form.Select
                name="region"
                value={form.region}
                onChange={(e) => {
                  handleChange(e);
                  setForm((prev) => ({ ...prev, ciudad: "" }));
                }}
                className="bg-dark text-white border-secondary"
              >
                <option value="">Seleccione una región</option>
                {regionesComunas.map((r) => (
                  <option key={r.region} value={r.region}>{r.region}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="ciudad">
              <Form.Label className="text-white">Ciudad/Comuna</Form.Label>
              <Form.Select
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                className="bg-dark text-white border-secondary"
                disabled={!form.region}
              >
                <option value="">Seleccione una comuna</option>
                {form.region && regionesComunas.find((r) => r.region === form.region).comunas.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="codigoPostal">
              <Form.Label className="text-white">Código Postal</Form.Label>
              <Form.Control name="codigoPostal" value={form.codigoPostal} onChange={handleChange} className="bg-dark text-white border-secondary" inputMode="numeric" maxLength={5} pattern="\\d{5}" />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" disabled={saving} style={{ backgroundColor: "#ff2d95", border: "none" }}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
        {saveMsg ? <span className="ms-3">{saveMsg}</span> : null}
      </Form>

      
    </Container>
  );
}
