import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

/**
 * Resolución de imagen:
 * - Si la ruta comienza con '/' se asume que está en public (p. ej. "/images/xxx.jpg")
 * - Si es sólo un nombre de archivo (p. ej. "xxx.jpg"), intenta resolver desde src/assets/images
 * - Devuelve una URL válida o ruta original; Card.Img maneja el onError para fallback.
 */
function resolveImagePath(imagen) {
  if (!imagen) return "/images/fallback.jpg";
  if (imagen.startsWith("/")) return imagen; // public folder
  try {
    // Si guardas en src/assets/images, la siguiente línea genera la URL bundlera de Vite
    return new URL(`../assets/images/${imagen}`, import.meta.url).href;
  } catch {
    // Fallback: devolver tal cual (quizás sea una URL absoluta)
    return imagen;
  }
}

export default function ProductCard({ id, nombre, precio, imagen, descripcion }) {
  const imgSrc = resolveImagePath(imagen);

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
            e.currentTarget.src = "/images/fallback.jpg";
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
