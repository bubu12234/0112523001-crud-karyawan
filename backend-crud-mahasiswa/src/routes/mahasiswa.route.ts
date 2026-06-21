import { Router, Request, Response } from "express";
import { mahasiswa, Mahasiswa } from "../data/mahasiswa.data";

const router = Router();

// SEARCH (Latihan Pertemuan 2)
// Endpoint diletakkan sebelum /:id agar tidak tertimpa oleh /:id
router.get("/search/:keyword", (req: Request, res: Response) => {
  const keyword = req.params.keyword.toLowerCase();
  const result = mahasiswa.filter((item) =>
    item.nama.toLowerCase().includes(keyword)
  );

  res.json({
    message: "Hasil pencarian mahasiswa",
    data: result,
  });
});

// READ ALL
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Data mahasiswa berhasil diambil",
    data: mahasiswa,
  });
});

// READ DETAIL
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = mahasiswa.find((item) => item.id === id);

  if (!data) {
    return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
  }

  res.json({
    message: "Detail mahasiswa berhasil diambil",
    data,
  });
});

// CREATE
router.post("/", (req: Request, res: Response) => {
  const { nim, nama, prodi, angkatan } = req.body;

  if (!nim || !nama || !prodi || !angkatan) {
    return res.status(400).json({
      message: "NIM, nama, prodi, dan angkatan wajib diisi",
    });
  }

  // Validasi agar nama minimal 3 karakter
  if (nama.length < 3) {
    return res.status(400).json({
      message: "Nama mahasiswa minimal harus 3 karakter",
    });
  }

  // Pengecekan agar NIM tidak duplikat
  const existingNim = mahasiswa.find((item) => item.nim === nim);
  if (existingNim) {
    return res.status(400).json({
      message: "NIM sudah terdaftar!",
    });
  }

  const newMahasiswa: Mahasiswa = {
    id: mahasiswa.length > 0 ? Math.max(...mahasiswa.map(m => m.id)) + 1 : 1,
    nim,
    nama,
    prodi,
    angkatan: Number(angkatan),
  };

  mahasiswa.push(newMahasiswa);

  res.status(201).json({
    message: "Mahasiswa berhasil ditambahkan",
    data: newMahasiswa,
  });
});

// UPDATE
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nim, nama, prodi, angkatan } = req.body;

  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
  }

  if (nama && nama.length < 3) {
    return res.status(400).json({
      message: "Nama mahasiswa minimal harus 3 karakter",
    });
  }

  // Cek duplikasi NIM saat update
  if (nim) {
    const existingNim = mahasiswa.find((item) => item.nim === nim && item.id !== id);
    if (existingNim) {
      return res.status(400).json({
        message: "NIM sudah dipakai mahasiswa lain",
      });
    }
  }

  mahasiswa[index] = {
    id,
    nim: nim || mahasiswa[index].nim,
    nama: nama || mahasiswa[index].nama,
    prodi: prodi || mahasiswa[index].prodi,
    angkatan: angkatan ? Number(angkatan) : mahasiswa[index].angkatan,
  };

  res.json({
    message: "Mahasiswa berhasil diperbarui",
    data: mahasiswa[index],
  });
});

// DELETE
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
  }

  const deletedData = mahasiswa.splice(index, 1);

  res.json({
    message: "Mahasiswa berhasil dihapus",
    data: deletedData[0],
  });
});

export default router;
