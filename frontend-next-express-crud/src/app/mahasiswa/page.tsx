"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  Mahasiswa,
  MahasiswaInput,
  updateMahasiswa,
} from "@/lib/api";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMahasiswa();
      setMahasiswa(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal terhubung ke API backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMahasiswa();
  }, []);

  const handleSubmit = async (payload: MahasiswaInput) => {
    try {
      setMessage("");
      setError("");

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, payload);
        setMessage("Data mahasiswa berhasil diperbarui!");
      } else {
        await createMahasiswa(payload);
        setMessage("Data mahasiswa berhasil ditambahkan!");
      }

      setSelectedMahasiswa(null);
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteMahasiswa(id);
      setMessage("Data mahasiswa berhasil dihapus.");
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data.");
    }
  };

  // Tugas 3 - Pencarian Data
  const filteredMahasiswa = mahasiswa.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.nim.includes(search)
  );

  return (
    <div className="app-container">
      <div className="page-header">
        <h1>Sistem Akademik - Data Mahasiswa</h1>
        <Link href="/">
          <button className="btn-secondary">Kembali</button>
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-section">
        <MahasiswaForm
          selectedMahasiswa={selectedMahasiswa}
          onSubmit={handleSubmit}
          onCancelEdit={() => setSelectedMahasiswa(null)}
        />

        <div>
          <div className="search-bar">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan Nama atau NIM..."
            />
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#64748b" }}>Memuat data mahasiswa...</p>
          ) : (
            <MahasiswaTable
              mahasiswa={filteredMahasiswa}
              onEdit={setSelectedMahasiswa}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
