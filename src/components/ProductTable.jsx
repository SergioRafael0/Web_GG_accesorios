import React from "react";
import { Table, Button } from "react-bootstrap";

export default function ProductTable({ productos, onDelete }) {
  return (
    <div className="table-responsive">
      <Table striped bordered hover variant="dark" className="align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>${p.precio.toLocaleString()}</td>
                <td>{p.categoria}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(p.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No hay productos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
