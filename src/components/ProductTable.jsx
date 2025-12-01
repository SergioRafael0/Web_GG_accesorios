import React from "react";
import { Table, Button } from "react-bootstrap";

export default function ProductTable({ productos, onDelete, onEdit }) {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Tipo</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p) => (
          <tr key={p.id}>
            <td>{p.nombre}</td>
            <td>{p.descripcion}</td>
            <td>{p.tipo}</td>
            <td>${p.precio.toLocaleString("es-CL")}</td>
            <td>{p.stock}</td>
            <td>{p.imagen ? <img src={String(p.imagen).replace(/[`]/g, "")} alt={p.nombre} style={{width:60,height:60,objectFit:"cover",borderRadius:8}}/> : "-"}</td>
            <td>
              <Button variant="secondary" size="sm" className="me-2" onClick={() => onEdit && onEdit(p)}>
                Editar
              </Button>
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
