"use client";

import { Mahasiswa } from "@/lib/api";

type Props = {
  mahasiswa: Mahasiswa[];
  onEdit: (item: Mahasiswa) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function MahasiswaTable({ mahasiswa, onEdit, onDelete }: Props) {
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
            <th width="5%">No</th>
            <th width="15%">NIM</th>
            <th width="25%">Nama Lengkap</th>
            <th width="25%">Program Studi</th>
            <th width="10%">Angkatan</th>
            <th width="20%" className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td className="font-medium">{item.nim}</td>
              <td>{item.nama}</td>
              <td>{item.prodi}</td>
              <td>{item.angkatan}</td>
              <td className="table-actions">
                <button className="btn-edit" onClick={() => onEdit(item)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => onDelete(item.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
