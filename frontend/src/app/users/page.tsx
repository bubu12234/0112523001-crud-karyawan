"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import UserForm from "@/components/UserForm";
import UserTable from "@/components/UserTable";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  User,
} from "@/lib/api";
import { getUser, isLoggedIn, logout, AuthUser } from "@/lib/auth";

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
    } else {
      const user = getUser();
      if (user?.role !== "admin") {
        window.location.href = "/mahasiswa"; // Redirect non-admin
      } else {
        setCurrentUser(user);
      }
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data user.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      loadUsers();
    }
  }, [currentUser, loadUsers]);

  const handleSubmit = async (data: any) => {
    try {
      setMessage("");
      setError("");

      if (selectedUser) {
        await updateUser(selectedUser.id, data);
        setMessage("User berhasil diperbarui!");
      } else {
        await createUser(data);
        setMessage("User baru berhasil ditambahkan!");
      }

      setSelectedUser(null);
      setIsFormOpen(false);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data.");
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      setMessage("");
      setError("");
      await deleteUser(id);
      setMessage("User berhasil dihapus.");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus user.");
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!window.confirm("Yakin ingin mereset password user ini?")) return;
    try {
      setMessage("");
      setError("");
      const result = await resetPassword(id);
      alert(`Password sementara: ${result.temporaryPassword}\n\nHarap simpan dan berikan ke user yang bersangkutan.`);
      setMessage("Password berhasil direset.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mereset password.");
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null; // Don't render until verified
  }

  return (
    <div className="app-container">
      <div className="page-header">
        <h1>Kelola User Sistem</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Halo, <strong>{currentUser.name}</strong>{" "}
            <span
              style={{
                fontSize: "0.75rem",
                padding: "2px 8px",
                borderRadius: "12px",
                background: "#fee2e2",
                color: "#991b1b",
                fontWeight: 500,
                textTransform: "uppercase",
              }}
            >
              ADMIN
            </span>
          </span>
          <Link href="/mahasiswa">
            <button className="btn-secondary">Data Mahasiswa</button>
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
        {!isFormOpen && (
          <button 
            className="btn-primary" 
            style={{ marginBottom: "15px", alignSelf: "flex-start" }}
            onClick={() => {
              setSelectedUser(null);
              setIsFormOpen(true);
            }}
          >
            Tambah User Baru
          </button>
        )}

        {/* Modal Pop-up for Form */}
        {isFormOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <UserForm
                selectedUser={selectedUser}
                onSubmit={handleSubmit}
                onCancelEdit={() => {
                  setSelectedUser(null);
                  setIsFormOpen(false);
                }}
              />
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
              Memuat data user...
            </p>
          ) : (
            <UserTable
              users={users}
              onEdit={(u) => {
                setSelectedUser(u);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
              onResetPassword={handleResetPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
}
