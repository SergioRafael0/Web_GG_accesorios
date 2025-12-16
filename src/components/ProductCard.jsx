import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { addItem as apiAddItem } from "../services/cart";

function cleanUrl(u) {
  let s = String(u || "").trim();
  s = s.replace(/^`+|`+$/g, "");
  s = s.replace(/^"+|"+$/g, "");
  s = s.replace(/^'+|'+$/g, "");
  return s;
}

function resolveRemoteOrLocal(imagen) {
  const raw = cleanUrl(imagen);
  if (!raw) return "/images/fallback.jpg";
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:")) return raw;
  if (raw.startsWith("/")) return encodeURI(raw);
  try {
    return new URL(`../assets/images/${raw}`, import.meta.url).href;
  } catch {
    return raw;
  }
}

export default function ProductCard({ id, nombre, precio, imagen, descripcion, stock }) {
  const imgSrc = resolveRemoteOrLocal(imagen);
  const disponible = typeof stock === "number" ? stock > 0 : true;
  const [addedMsg, setAddedMsg] = useState("");

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          await apiAddItem(id, 1);
          window.dispatchEvent(new Event("cartUpdated"));
          setAddedMsg("Producto añadido al carrito");
          setTimeout(() => setAddedMsg(""), 2000);
        } catch {
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const found = cart.find((item) => item.id === id);
          if (found) {
            found.quantity = (Number(found.quantity) || Number(found.qty) || 0) + 1;
          } else {
            cart.push({ id, nombre, precio, imagen: imgSrc, quantity: 1 });
          }
          localStorage.setItem("cart", JSON.stringify(cart));
          window.dispatchEvent(new Event("cartUpdated"));
          setAddedMsg("Producto añadido al carrito");
          setTimeout(() => setAddedMsg(""), 2000);
        }
      })();
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const found = cart.find((item) => item.id === id);
      if (found) {
        found.quantity = (Number(found.quantity) || Number(found.qty) || 0) + 1;
      } else {
        cart.push({ id, nombre, precio, imagen: imgSrc, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      setAddedMsg("Producto añadido al carrito");
      setTimeout(() => setAddedMsg(""), 2000);
    }
  };

  return (
    <Card className="product-card h-100">
      <Link to={`/productos/${id}`}>
        <Card.Img
          variant="top"
          src={imgSrc}
          alt={nombre}
          style={{ height: "220px", objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://via.placeholder.com/400x220?text=Sin+imagen";
          }}
        />
      </Link>

      <Card.Body className="product-body">
        <Card.Title className="fw-bold">{nombre}</Card.Title>
        <Card.Text className="text-muted small mb-2">{descripcion}</Card.Text>
        {typeof stock === "number" ? <div className="text-white-50 small mb-2">Stock: {stock}</div> : null}

        <div className="mt-auto">
          <h6 className="price mb-3">${Number(precio).toLocaleString("es-CL")}</h6>

          <div className="card-actions d-grid gap-2">
            {addedMsg ? <Alert variant="success" className="py-1 mb-2">{addedMsg}</Alert> : null}
            <Button
              as={Link}
              to={`/productos/${id}`}
              variant="outline-light"
              className="w-100"
            >
              Ver detalle
            </Button>

            <Button
              variant="primary"
              className="w-100"
              style={{ backgroundColor: "#ff2d95", border: "none" }}
              onClick={handleAddToCart}
              disabled={!disponible}
            >
              {disponible ? "Añadir al carrito" : "Sin stock"}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
