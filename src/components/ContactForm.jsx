import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", mensaje: "", terms: false });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = "Ingresa un nombre válido (mín 2 letras)";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email || "")) e.email = "Ingresa un email válido";
    if (!form.mensaje || form.mensaje.trim().length < 8) e.mensaje = "Escribe un mensaje más detallado (mín 8 caracteres)";
    if (!form.terms) e.terms = "Debes aceptar ser contactado";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setSuccess("");
    if (validate()) {
      setSuccess("Gracias — tu mensaje ha sido enviado.");
      setForm({ name: "", email: "", mensaje: "", terms: false });
      const btn = ev.target.querySelector('button[type="submit"]');
      if (btn) {
        const prev = btn.textContent;
        btn.textContent = "Mensaje enviado";
        setTimeout(() => btn.textContent = prev, 2000);
      }
    }
  };

  return (
    <form id="contact-form" noValidate onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="name">Nombre</label>
        <input  className="form-control bg-dark text-white border-secondary" id="name" name="name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required minLength={2} />
        <small className="error">{errors.name}</small>
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input  className="form-control bg-dark text-white border-secondary" id="email" name="email" type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} required />
        <small className="error">{errors.email}</small>
      </div>
      <div className="form-row">
        <label htmlFor="mensaje">Mensaje</label>
        <textarea  className="form-control bg-dark text-white border-secondary" id="mensaje" name="mensaje" rows={4} value={form.mensaje} onChange={(e)=>setForm({...form, mensaje: e.target.value})} required minLength={8} />
        <small className="error">{errors.mensaje}</small>
      </div>
      <div className="form-row checkbox-row">
        <label className="checkbox">
          <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={(e)=>setForm({...form, terms: e.target.checked})} /> Acepto que me contacten
        </label>
        <small className="error">{errors.terms}</small>
      </div>
      <div className="form-row">
        <button className="btn-primary" type="submit">Enviar</button>
      </div>
      <div id="form-success" className="form-success" role="status" aria-live="polite">{success}</div>
    </form>
  );
}