import React from "react";
import { Table, Button } from "react-bootstrap";

export default function ProductTable({ productos, onDelete }) {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p) => (
          <tr key={p.id}>
            <td>{p.nombre}</td>
            <td>${p.precio.toLocaleString("es-CL")}</td>
            <td>
              <Button variant="danger" size="sm" onClick={() => onDelete(p.id)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
