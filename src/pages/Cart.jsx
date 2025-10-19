import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
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
    const updatedCart = cart.filter(item => item.id !== id);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Carrito de Compras</h2>

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
                  <td>{item.quantity}</td>
                  <td>${(Number(item.precio) * item.quantity).toLocaleString("es-CL")}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h4>Total: ${total.toLocaleString("es-CL")}</h4>

          <div className="d-flex gap-2 mt-3">
            <Button variant="secondary" onClick={clearCart}>
              Vaciar Carrito
            </Button>
            <Link to="/checkout">
              <Button style={{ backgroundColor: "#ff2d95", border: "none" }}>
                Finalizar Compra
              </Button>
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}
