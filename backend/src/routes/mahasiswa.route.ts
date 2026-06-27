import { Router } from "express";
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";
import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();

// GET  — admin, operator, viewer boleh melihat
router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "operator", "viewer"),
  getAllMahasiswa
);

// POST — admin dan operator boleh menambah
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "operator"),
  uploadFotoMahasiswa.single("foto"),
  createMahasiswa
);

// PUT  — admin dan operator boleh mengedit
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin", "operator"),
  uploadFotoMahasiswa.single("foto"),
  updateMahasiswa
);

// DELETE — hanya admin boleh menghapus
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  deleteMahasiswa
);

export default router;
