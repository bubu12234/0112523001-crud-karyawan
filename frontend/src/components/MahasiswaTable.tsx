"use client";

import { Mahasiswa, BACKEND_URL } from "@/lib/api";
import { getUser } from "@/lib/auth";

type Props = {
  mahasiswa: Mahasiswa[];
  onEdit: (item: Mahasiswa) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function MahasiswaTable({ mahasiswa, onEdit, onDelete }: Props) {
  const user = getUser();
  const role = user?.role;
  const canEdit = role === "admin" || role === "operator";
  const canDelete = role === "admin";
  const hasActions = canEdit || canDelete;

  if (mahasiswa.length === 0) {
    return (
      <div className="empty-state">
        <p>Belum ada data mahasiswa yang terdaftar.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: "5%" }}>No</th>
            <th style={{ width: "10%" }}>Foto</th>
            <th style={{ width: "15%" }}>NIM</th>
            <th style={{ width: "25%" }}>Nama Lengkap</th>
            <th style={{ width: "20%" }}>Program Studi</th>
            <th style={{ width: "10%" }}>Angkatan</th>
            {hasActions && <th style={{ width: "15%" }} className="text-center">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={
                    item.foto
                      ? `${BACKEND_URL}/uploads/mahasiswa/${item.foto}`
                      : "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(item.nama)
                  }
                  alt={item.nama}
                  width={40}
                  height={40}
                  className="avatar-thumbnail"
                  onError={(e) => {
                    // Fallback to initial image if local image fails to load
                    (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(item.nama);
                  }}
                />
              </td>
              <td className="font-medium">{item.nim}</td>
              <td>{item.nama}</td>
              <td>{item.nama_prodi || "Tidak Diketahui"}</td>
              <td>{item.angkatan}</td>
              {hasActions && (
                <td className="table-actions">
                  {canEdit && (
                    <button className="btn-edit" onClick={() => onEdit(item)}>
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button className="btn-delete" onClick={() => onDelete(item.id)}>
                      Hapus
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
