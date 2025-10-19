import React from "react";
import { Table, Button } from "react-bootstrap";

export default function EventTable({ eventos, onDelete }) {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Nombre</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {eventos.map((e) => (
          <tr key={e.id}>
            <td>{e.tipo}</td>
            <td>{e.nombre}</td>
            <td>{e.fecha}</td>
            <td>
              <Button variant="danger" size="sm" onClick={() => onDelete(e.id)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
