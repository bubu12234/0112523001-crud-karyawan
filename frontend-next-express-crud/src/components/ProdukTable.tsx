"use client";

import { Produk } from "@/lib/apiProduk";

type Props = {
  produk: Produk[];
  onEdit: (item: Produk) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function ProdukTable({ produk, onEdit, onDelete }: Props) {
  if (produk.length === 0) {
    return (
      <div className="empty-state">
        <p>Belum ada data produk yang tersedia.</p>
      </div>
    );
  }

  // Format IDR helper
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th width="5%">No</th>
            <th width="40%">Nama Produk</th>
            <th width="20%">Harga</th>
            <th width="15%">Stok</th>
            <th width="20%" className="text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {produk.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td className="font-medium">{item.nama}</td>
              <td>{formatRupiah(item.harga)}</td>
              <td>{item.stok}</td>
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
