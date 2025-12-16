import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Failure() {
  let errorMsg = "";
  try {
    const params = new URLSearchParams(window.location.search);
    errorMsg = params.get("error") || "";
  } catch {
    void 0;
  }
  try {
    const st = history.state;
    if (st && st.usr && st.usr.error) errorMsg = st.usr.error;
  } catch {
    void 0;
  }
  return (
    <Container className="py-5 text-center">
      <h2 className="mb-4 text-danger">Error en la compra ❌</h2>
      <p>Hubo un problema procesando tu pago. Intenta nuevamente.</p>
      {errorMsg ? <p className="text-white-50">{errorMsg}</p> : null}
      <Link to="/checkout">
        <Button style={{ backgroundColor: "#ff2d95", border: "none" }}>Reintentar</Button>
      </Link>
    </Container>
  );
}
