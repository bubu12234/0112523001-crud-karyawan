"use client";

import { useState, useEffect } from "react";
import { saveAuth, isLoggedIn } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already-logged-in users
  useEffect(() => {
    if (isLoggedIn()) {
      window.location.href = "/mahasiswa";
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login gagal");
        return;
      }

      saveAuth(result.token, result.user);
      window.location.href = "/mahasiswa";
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
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "0 20px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              background: "#e0e7ff",
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
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
            Sistem Akademik
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Masukkan akun Anda untuk melanjutkan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="form-container">
          <h3 style={{ marginBottom: "20px" }}>Login</h3>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: "16px" }}>
              {error}
            </div>
          )}

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
              autoComplete="current-password"
            />
          </div>

          <div className="form-actions" style={{ marginTop: "24px" }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Belum punya akun?{" "}
          <a href="/register" style={{ color: "var(--primary-color)", fontWeight: 500 }}>
            Daftar di sini
          </a>
        </p>
      </div>
    </main>
  );
}
