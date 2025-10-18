import React from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Cart() {
  const cartItems = [
    { id: 1, title: "Teclado Koneko", price: 99990, quantity: 1 },
    { id: 2, title: "Auriculares Urbano Red", price: 59990, quantity: 2 },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Carrito de Compras</h2>
      <Table striped bordered hover variant="dark" responsive>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>${item.price.toLocaleString()}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h4>Total: ${total.toLocaleString()}</h4>
      <Link to="/checkout">
        <Button className="mt-3" style={{ backgroundColor: "#ff2d95", border: "none" }}>
          Finalizar Compra
        </Button>
      </Link>
    </Container>
  );
}