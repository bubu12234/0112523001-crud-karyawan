"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  getProdi,
  Mahasiswa,
  Prodi,
  updateMahasiswa,
} from "@/lib/api";
import { getUser, isLoggedIn, logout, AuthUser } from "@/lib/auth";

export default function MahasiswaPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPage, setTotalPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Auth guard — redirect to /login if not authenticated
  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
    } else {
      setUser(getUser());
    }
  }, []);

  const loadProdi = async () => {
    try {
      const data = await getProdi();
      setProdiList(data);
    } catch (err) {
      console.error("Gagal mengambil data program studi:", err);
    }
  };

  const loadMahasiswa = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit,
      });
      setMahasiswa(result.data);
      setTotalPage(result.meta?.totalPage || 1);
      setTotalItems(result.meta?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal terhubung ke API backend.");
    } finally {
      setLoading(false);
    }
  }, [search, prodiId, page, limit]);

  useEffect(() => {
    loadProdi();
  }, []);

  useEffect(() => {
    loadMahasiswa();
  }, [page, prodiId]);

  const handleSearch = () => {
    setPage(1);
    loadMahasiswa();
  };

  const handleProdiFilterChange = (val: string) => {
    setProdiId(val);
    setPage(1);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setMessage("");
      setError("");

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setMessage("Data mahasiswa berhasil diperbarui!");
      } else {
        await createMahasiswa(formData);
        setMessage("Data mahasiswa berhasil ditambahkan!");
      }

      setSelectedMahasiswa(null);
      setIsFormOpen(false);
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data.");
      throw err;
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

      if (mahasiswa.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadMahasiswa();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data.");
    }
  };

  const role = user?.role;
  const canCreate = role === "admin" || role === "operator";
  const canEdit = role === "admin" || role === "operator";

  return (
    <div className="app-container">
      <div className="page-header">
        <h1>Sistem Akademik - Data Mahasiswa</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {user && (
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Halo, <strong>{user.name}</strong>{" "}
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: "#e0e7ff",
                  color: "#2563eb",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                {user.role}
              </span>
            </span>
          )}
          {user?.role === "admin" && (
            <Link href="/users">
              <button className="btn-secondary">Kelola User</button>
            </Link>
          )}
          <Link href="/">
            <button className="btn-secondary">Beranda</button>
          </Link>
          <button
            className="btn-delete"
            style={{ padding: "8px 14px" }}
            onClick={() => {
              if (window.confirm("Yakin ingin logout?")) logout();
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-section">
        {user && canCreate && (
          <MahasiswaForm
            selectedMahasiswa={null}
            onSubmit={handleSubmit}
            onCancelEdit={() => {}}
          />
        )}

        {isFormOpen && selectedMahasiswa && (
          <div className="modal-overlay">
            <div className="modal-content">
              <MahasiswaForm
                selectedMahasiswa={selectedMahasiswa}
                onSubmit={handleSubmit}
                onCancelEdit={() => {
                  setSelectedMahasiswa(null);
                  setIsFormOpen(false);
                }}
              />
            </div>
          </div>
        )}

        <div>
          {/* Filter and Search Controls */}
          <div className="filter-bar">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Cari berdasarkan Nama atau NIM..."
            />

            <select
              value={prodiId}
              onChange={(e) => handleProdiFilterChange(e.target.value)}
            >
              <option value="">Semua Program Studi</option>
              {prodiList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama_prodi}
                </option>
              ))}
            </select>

            <button onClick={handleSearch} className="btn-primary">
              Cari
            </button>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
              Memuat data mahasiswa...
            </p>
          ) : (
            <>
              <MahasiswaTable
                mahasiswa={mahasiswa}
                onEdit={(m) => {
                  setSelectedMahasiswa(m);
                  setIsFormOpen(true);
                }}
                onDelete={handleDelete}
              />

              {/* Pagination Controls */}
              {totalPage > 1 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Halaman {page} dari {totalPage} (Total: {totalItems} Mahasiswa)
                  </div>
                  <div className="pagination-actions">
                    <button
                      className="btn-secondary"
                      disabled={page <= 1}
                      onClick={() => setPage((prev) => prev - 1)}
                    >
                      Sebelumnya
                    </button>
                    <button
                      className="btn-secondary"
                      disabled={page >= totalPage}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
