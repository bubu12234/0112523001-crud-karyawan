"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProdukForm from "@/components/ProdukForm";
import ProdukTable from "@/components/ProdukTable";
import {
  createProduk,
  deleteProduk,
  getProduk,
  Produk,
  ProdukInput,
  updateProduk,
} from "@/lib/apiProduk";

export default function ProdukPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadProduk = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProduk();
      setProduk(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal terhubung ke API backend. Pastikan server backend sudah dijalankan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduk();
  }, []);

  const handleSubmit = async (payload: ProdukInput) => {
    try {
      setMessage("");
      setError("");

      if (selectedProduk) {
        await updateProduk(selectedProduk.id, payload);
        setMessage("Data produk berhasil diperbarui!");
      } else {
        await createProduk(payload);
        setMessage("Data produk berhasil ditambahkan!");
      }

      setSelectedProduk(null);
      await loadProduk();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus data produk ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteProduk(id);
      setMessage("Data produk berhasil dihapus.");
      await loadProduk();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data.");
    }
  };

  // Search filter
  const filteredProduk = produk.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="page-header">
        <h1>Katalog - Data Produk</h1>
        <Link href="/">
          <button className="btn-secondary">Kembali</button>
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-section">
        <ProdukForm
          selectedProduk={selectedProduk}
          onSubmit={handleSubmit}
          onCancelEdit={() => setSelectedProduk(null)}
        />

        <div>
          <div className="search-bar">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nama produk..."
            />
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#64748b" }}>Memuat data produk...</p>
          ) : (
            <ProdukTable
              produk={filteredProduk}
              onEdit={setSelectedProduk}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
