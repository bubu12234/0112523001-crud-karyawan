"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mahasiswa, MahasiswaInput } from "@/lib/api";

type Props = {
  selectedMahasiswa: Mahasiswa | null;
  onSubmit: (payload: MahasiswaInput) => Promise<void>;
  onCancelEdit: () => void;
};

const initialForm: MahasiswaInput = {
  nim: "",
  nama: "",
  prodi: "",
  angkatan: "" as unknown as number,
};

export default function MahasiswaForm({
  selectedMahasiswa,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [form, setForm] = useState<MahasiswaInput>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        prodi: selectedMahasiswa.prodi,
        angkatan: selectedMahasiswa.angkatan,
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedMahasiswa]);

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
      <h3>{selectedMahasiswa ? "Edit Data Mahasiswa" : "Tambah Data Mahasiswa"}</h3>
      
      <div className="form-group">
        <label htmlFor="nim">Nomor Induk Mahasiswa (NIM)</label>
        <input
          id="nim"
          value={form.nim}
          onChange={(e) => setForm({ ...form, nim: e.target.value })}
          placeholder="Masukkan NIM"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="nama">Nama Lengkap</label>
        <input
          id="nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="prodi">Program Studi</label>
          <input
            id="prodi"
            value={form.prodi}
            onChange={(e) => setForm({ ...form, prodi: e.target.value })}
            placeholder="Contoh: Informatika"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="angkatan">Tahun Angkatan</label>
          <input
            id="angkatan"
            type="number"
            value={form.angkatan}
            onChange={(e) =>
              setForm({ ...form, angkatan: Number(e.target.value) })
            }
            placeholder="Contoh: 2024"
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Menyimpan..." : selectedMahasiswa ? "Simpan Perubahan" : "Tambah Data"}
        </button>

        {selectedMahasiswa && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
