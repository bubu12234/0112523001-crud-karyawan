"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Registrasi gagal");
        return;
      }

      setSuccess("Registrasi berhasil! Silakan login.");
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-color)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px", padding: "0 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              background: "#dcfce7",
              borderRadius: "50%",
              marginBottom: "16px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
            Daftar Akun
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Buat akun baru untuk mengakses sistem
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="form-container">
          <h3 style={{ marginBottom: "20px" }}>Registrasi</h3>

          {error && <div className="alert alert-error" style={{ marginBottom: "16px" }}>{error}</div>}
          {success && <div className="alert alert-success" style={{ marginBottom: "16px" }}>{success}</div>}

          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="form-actions" style={{ marginTop: "24px" }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Sudah punya akun?{" "}
          <a href="/login" style={{ color: "var(--primary-color)", fontWeight: 500 }}>
            Login di sini
          </a>
        </p>
      </div>
    </main>
  );
}
