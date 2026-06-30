import { getToken } from "./auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi?: string;
  angkatan: number;
  foto?: string | null;
  created_at?: string;
};

export type Prodi = {
  id: number;
  nama_prodi: string;
};

export type MahasiswaInput = {
  nim: string;
  nama: string;
  prodi_id: number;
  angkatan: number;
  foto?: File | null;
};

type ApiResponse<T> = {
  message: string;
  data?: T;
  meta?: any;
};

// Helper: build Authorization header from localStorage token
function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper: handle 401 by redirecting to login
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (response.status === 401) {
    // Token expired or invalid — redirect to login
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error("Sesi habis, silakan login kembali");
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan saat mengakses API");
  }

  return result;
}

export async function getProdi(): Promise<Prodi[]> {
  const response = await fetch(`${API_URL}/prodi`, {
    cache: "no-store",
  });
  const result = await handleResponse<Prodi[]>(response);
  return result.data || [];
}

export async function getMahasiswa(params?: {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Mahasiswa[]; meta: any }> {
  const query = new URLSearchParams();

  if (params?.search) query.set("search", params.search);
  if (params?.prodi_id) query.set("prodi_id", params.prodi_id);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const response = await fetch(`${API_URL}/mahasiswa?${query.toString()}`, {
    cache: "no-store",
    headers: authHeader(),
  });

  const result = await response.json();

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error("Sesi habis, silakan login kembali");
  }

  if (!response.ok) throw new Error(result.message);
  return { data: result.data || [], meta: result.meta };
}

export async function createMahasiswa(formData: FormData): Promise<Mahasiswa> {
  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  });

  const result = await handleResponse<Mahasiswa>(response);
  return result.data as Mahasiswa;
}

export async function updateMahasiswa(
  id: number,
  formData: FormData
): Promise<void> {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: formData,
  });

  await handleResponse(response);
}

export async function deleteMahasiswa(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  await handleResponse(response);
}

// --- Users (Admin Only) ---
export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  created_at?: string;
};

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`, {
    headers: authHeader(),
  });
  const data = await handleResponse(response);
  return data.data;
}

export async function createUser(data: any) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateUser(id: number, data: any) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteUser(id: number) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return handleResponse(response);
}

export async function resetPassword(id: number) {
  const response = await fetch(`${API_URL}/users/${id}/reset-password`, {
    method: "PATCH",
    headers: authHeader(),
  });
  return handleResponse(response);
}
