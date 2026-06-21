import Link from "next/link";

export default function HomePage() {
  return (
    <main className="app-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", paddingTop: "40px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--text-main)" }}>Integrasi Next.js & Express.js</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          Aplikasi dashboard praktikum terintegrasi untuk mengelola data Mahasiswa dan Katalog Produk.
        </p>
      </div>

      <div style={{ display: "flex", gap: "24px", width: "100%", maxWidth: "600px", justifyContent: "center", flexWrap: "wrap" }}>
        
        {/* Card Mahasiswa */}
        <div className="form-container" style={{ flex: "1 1 250px", display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px", textAlign: "center" }}>
          <div style={{ padding: "16px", borderRadius: "50%", background: "#e0e7ff", marginBottom: "16px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px" }}>Data Mahasiswa</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px", flex: 1 }}>
            Kelola data akademik mahasiswa dan tahun angkatan.
          </p>
          <Link href="/mahasiswa" style={{ width: "100%", textDecoration: "none" }}>
            <button className="btn-primary" style={{ width: "100%" }}>Buka</button>
          </Link>
        </div>

        {/* Card Produk */}
        <div className="form-container" style={{ flex: "1 1 250px", display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px", textAlign: "center" }}>
          <div style={{ padding: "16px", borderRadius: "50%", background: "#dcfce7", marginBottom: "16px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px" }}>Data Produk</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px", flex: 1 }}>
            Kelola inventori, harga, dan ketersediaan stok produk.
          </p>
          <Link href="/produk" style={{ width: "100%", textDecoration: "none" }}>
            <button className="btn-secondary" style={{ width: "100%" }}>Buka</button>
          </Link>
        </div>

      </div>
    </main>
  );
}
