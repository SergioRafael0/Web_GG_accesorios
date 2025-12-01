import React from "react";
import { Table, Button } from "react-bootstrap";

export default function UserTable({ usuarios, onDelete, onEdit }) {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <tr key={u.id || u.user?.id}>
            <td>{u?.profile?.nombre || u?.nombre || "-"}</td>
            <td>{u?.email || u?.user?.email || "-"}</td>
            <td>{u?.role || u?.user?.role || "-"}</td>
            <td>
              <Button variant="secondary" size="sm" className="me-2" onClick={() => onEdit && onEdit(u)}>
                Editar
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(u.id || u.user?.id)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
