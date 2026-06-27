"use client";

import { FormEvent, useEffect, useState } from "react";
import { Produk, ProdukInput } from "@/lib/apiProduk";

type Props = {
  selectedProduk: Produk | null;
  onSubmit: (payload: ProdukInput) => Promise<void>;
  onCancelEdit: () => void;
};

const initialForm: ProdukInput = {
  nama: "",
  harga: "" as unknown as number,
  stok: "" as unknown as number,
};

export default function ProdukForm({
  selectedProduk,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [form, setForm] = useState<ProdukInput>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProduk) {
      setForm({
        nama: selectedProduk.nama,
        harga: selectedProduk.harga,
        stok: selectedProduk.stok,
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedProduk]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await onSubmit(form);
      setForm(initialForm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>{selectedProduk ? "Edit Data Produk" : "Tambah Data Produk"}</h3>

      <div className="form-group">
        <label htmlFor="nama">Nama Produk</label>
        <input
          id="nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          placeholder="Masukkan nama produk"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="harga">Harga (Rp)</label>
          <input
            id="harga"
            type="number"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })}
            placeholder="Contoh: 8500000"
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stok">Stok Produk</label>
          <input
            id="stok"
            type="number"
            value={form.stok}
            onChange={(e) => setForm({ ...form, stok: Number(e.target.value) })}
            placeholder="Contoh: 10"
            required
            min="0"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Menyimpan..." : selectedProduk ? "Simpan Perubahan" : "Tambah Data"}
        </button>

        {selectedProduk && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
