"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mahasiswa, getProdi, Prodi, BACKEND_URL } from "@/lib/api";

type Props = {
  selectedMahasiswa: Mahasiswa | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancelEdit: () => void;
};

export default function MahasiswaForm({
  selectedMahasiswa,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Load prodi list for dropdown
  useEffect(() => {
    const loadProdi = async () => {
      try {
        const data = await getProdi();
        setProdiList(data);
      } catch (err) {
        console.error("Gagal mengambil data program studi:", err);
      }
    };
    loadProdi();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (selectedMahasiswa) {
      setNim(selectedMahasiswa.nim);
      setNama(selectedMahasiswa.nama);
      setProdiId(String(selectedMahasiswa.prodi_id));
      setAngkatan(String(selectedMahasiswa.angkatan));
      setFotoFile(null);
      if (selectedMahasiswa.foto) {
        setFotoPreview(`${BACKEND_URL}/uploads/mahasiswa/${selectedMahasiswa.foto}`);
      } else {
        setFotoPreview(null);
      }
    } else {
      setNim("");
      setNama("");
      setProdiId("");
      setAngkatan("");
      setFotoFile(null);
      setFotoPreview(null);
    }
  }, [selectedMahasiswa]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError("Ukuran file maksimal adalah 2 MB");
        return;
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setFormError("Format file harus berupa JPG, PNG, atau WEBP");
        return;
      }
      setFormError("");
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nim || !nama || !prodiId || !angkatan) {
      setFormError("Semua field wajib diisi kecuali foto");
      return;
    }

    setLoading(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("nim", nim);
      formData.append("nama", nama);
      formData.append("prodi_id", prodiId);
      formData.append("angkatan", angkatan);
      if (fotoFile) {
        formData.append("foto", fotoFile);
      }

      await onSubmit(formData);
      
      // Reset form if not editing
      if (!selectedMahasiswa) {
        setNim("");
        setNama("");
        setProdiId("");
        setAngkatan("");
        setFotoFile(null);
        setFotoPreview(null);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>{selectedMahasiswa ? "Edit Data Mahasiswa" : "Tambah Data Mahasiswa"}</h3>
      
      {formError && <div className="alert alert-error">{formError}</div>}

      <div className="form-group">
        <label htmlFor="nim">Nomor Induk Mahasiswa (NIM)</label>
        <input
          id="nim"
          type="text"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="nama">Nama Lengkap</label>
        <input
          id="nama"
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="prodi">Program Studi</label>
          <select
            id="prodi"
            value={prodiId}
            onChange={(e) => setProdiId(e.target.value)}
            required
          >
            <option value="">Pilih Program Studi</option>
            {prodiList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama_prodi}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="angkatan">Tahun Angkatan</label>
          <input
            id="angkatan"
            type="number"
            value={angkatan}
            onChange={(e) => setAngkatan(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="foto">Foto Profil (Opsional, JPG/PNG/WEBP maks 2MB)</label>
        <div className="file-input-wrapper">
          <input
            id="foto"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileChange}
          />
          {fotoPreview && (
            <div className="file-preview">
              <img
                src={fotoPreview}
                alt="Pratinjau Foto"
                width={70}
                height={70}
                style={{ borderRadius: "8px", objectFit: "cover", border: "1px solid var(--border-color)" }}
              />
              <button
                type="button"
                className="btn-delete"
                style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                onClick={() => {
                  setFotoFile(null);
                  setFotoPreview(null);
                  // Reset input file element
                  const input = document.getElementById("foto") as HTMLInputElement;
                  if (input) input.value = "";
                }}
              >
                Hapus
              </button>
            </div>
          )}
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
