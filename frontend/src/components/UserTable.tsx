"use client";

import { User } from "@/lib/api";

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onResetPassword: (id: number) => void;
};

export default function UserTable({ users, onEdit, onDelete, onResetPassword }: Props) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-state">
                Tidak ada data user.
              </td>
            </tr>
          ) : (
            users.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      background:
                        item.role === "admin"
                          ? "#fee2e2"
                          : item.role === "operator"
                          ? "#fef08a"
                          : "#e0e7ff",
                      color:
                        item.role === "admin"
                          ? "#991b1b"
                          : item.role === "operator"
                          ? "#854d0e"
                          : "#3730a3",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.role}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "0.9rem" }}
                      onClick={() => onResetPassword(item.id)}
                    >
                      Reset Password
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
