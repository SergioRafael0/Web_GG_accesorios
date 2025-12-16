import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getCart as apiGetCart, removeItem as apiRemoveItem, updateItem as apiUpdateItem } from "../services/cart";
import { datosCompra as apiDatosCompra } from "../services/auth";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [perfilError, setPerfilError] = useState("");
  const envioBloqueado = !!perfilError;

  const loadCart = () => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          const server = await apiGetCart();
          const items = Array.isArray(server?.items) ? server.items : [];
          const mapped = items.map((it) => ({
            id: it.productoId,
            nombre: it.nombre,
            precio: it.precioUnitario,
            quantity: it.cantidad,
            imagen: it.imagen,
          }));
          setCart(mapped);
          try {
            const datos = await apiDatosCompra();
            try { localStorage.setItem("checkoutPrefill", JSON.stringify(datos || {})); } catch { void 0; }
            const required = ["nombre","apellido","telefono","direccion","region","ciudad","codigoPostal"];
            const ok = required.every((k) => {
              const v = datos?.[k] ?? datos?.profile?.[k];
              return v !== undefined && v !== null && String(v).trim().length > 0;
            });
            setPerfilError(ok ? "" : "datos_envio_incompletos");
          } catch {
            setPerfilError("datos_envio_incompletos");
          }
          return;
        } catch {
          // fallback local
        }
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
        setPerfilError("");
        try {
          const raw = localStorage.getItem("usuarioActivo");
          const u = raw ? JSON.parse(raw) : null;
          const datos = u?.profile ? { ...u.profile, email: u.email } : null;
          if (datos) localStorage.setItem("checkoutPrefill", JSON.stringify(datos));
        } catch { void 0; }
      })();
    } else {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
      setPerfilError("");
      try {
        const raw = localStorage.getItem("usuarioActivo");
        const u = raw ? JSON.parse(raw) : null;
        const datos = u?.profile ? { ...u.profile, email: u.email } : null;
        if (datos) localStorage.setItem("checkoutPrefill", JSON.stringify(datos));
      } catch { void 0; }
    }
  };

  useEffect(() => {
    loadCart(); // Cargar al montar

    // Escuchar cambios globales del carrito
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const updateCart = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeFromCart = (id) => {
    if (envioBloqueado) return;
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          await apiRemoveItem(id);
          loadCart();
          return;
        } catch {
          // fallback local
        }
        const updatedCart = cart.filter(item => item.id !== id);
        updateCart(updatedCart);
      })();
    } else {
      const updatedCart = cart.filter(item => item.id !== id);
      updateCart(updatedCart);
    }
  };

  const clearCart = () => {
    updateCart([]);
  };

  const setQuantity = (id, quantity) => {
    if (envioBloqueado) return;
    const q = Math.max(0, Number(quantity) || 0);
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          await apiUpdateItem(id, q);
          loadCart();
          return;
        } catch {
          void 0;
        }
        const updated = cart.map((it) => {
          if (it.id === id) {
            return { ...it, quantity: q };
          }
          return it;
        }).filter((it) => it.quantity > 0);
        updateCart(updated);
      })();
    } else {
      const updated = cart.map((it) => {
        if (it.id === id) {
          return { ...it, quantity: q };
        }
        return it;
      }).filter((it) => it.quantity > 0);
      updateCart(updated);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Carrito de Compras</h2>
      {envioBloqueado ? (
        <div className="alert alert-warning" role="alert">
          Tu perfil tiene datos de envío incompletos. Completa nombre, apellido, teléfono, dirección, región, ciudad y código postal para continuar. Código: datos_envio_incompletos
        </div>
      ) : null}

      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>${Number(item.precio).toLocaleString("es-CL")}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || envioBloqueado}
                      >
                        −
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        disabled={envioBloqueado}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>${(Number(item.precio) * item.quantity).toLocaleString("es-CL")}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      disabled={envioBloqueado}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h4>Total: ${total.toLocaleString("es-CL")}</h4>

          {/* Prefill cargado pero sin mostrar UI explícita */}

          <div className="d-flex gap-2 mt-3">
            <Button variant="secondary" onClick={clearCart}>
              Vaciar Carrito
            </Button>
            <Link to="/checkout">
              <Button style={{ backgroundColor: "#ff2d95", border: "none" }} disabled={envioBloqueado}>
                Finalizar Compra
              </Button>
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}
