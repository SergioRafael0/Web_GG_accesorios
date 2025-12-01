import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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

export default function ProductCard({ id, nombre, precio, imagen, descripcion }) {
  const imgSrc = resolveRemoteOrLocal(imagen);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const found = cart.find((item) => item.id === id);

    if (found) {
      found.quantity = (Number(found.quantity) || Number(found.qty) || 0) + 1;
    } else {
      cart.push({ id, nombre, precio, imagen: imgSrc, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
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

        <div className="mt-auto">
          <h6 className="price mb-3">${Number(precio).toLocaleString("es-CL")}</h6>

          <div className="card-actions d-grid gap-2">
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
            >
              Añadir al carrito
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
