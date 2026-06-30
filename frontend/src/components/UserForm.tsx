"use client";

import { FormEvent, useEffect, useState } from "react";
import { User } from "@/lib/api";

type Props = {
  selectedUser: User | null;
  onSubmit: (data: any) => Promise<void>;
  onCancelEdit: () => void;
};

export default function UserForm({ selectedUser, onSubmit, onCancelEdit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setRole(selectedUser.role);
      setPassword(""); // Password kosong saat edit
    } else {
      setName("");
      setEmail("");
      setRole("viewer");
      setPassword("");
    }
  }, [selectedUser]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      const data = { name, email, role, password };
      if (selectedUser) {
        delete data.password; // Jangan kirim password kosong saat edit
      }
      
      await onSubmit(data);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>{selectedUser ? "Edit User" : "Tambah User"}</h3>
      
      {formError && <div className="alert alert-error">{formError}</div>}

      <div className="form-group">
        <label>Nama Lengkap</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {!selectedUser && (
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      )}

      <div className="form-group">
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="viewer">Viewer</option>
          <option value="operator">Operator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Data"}
        </button>
        {selectedUser && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
