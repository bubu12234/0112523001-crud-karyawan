import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

/**
 * Middleware factory untuk membatasi akses berdasarkan role user.
 * Harus digunakan SETELAH authMiddleware agar req.user sudah terisi.
 *
 * Contoh penggunaan:
 *   router.delete("/:id", authMiddleware, allowRoles("admin"), deleteMahasiswa);
 */
export const allowRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "User belum login" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses ke fitur ini",
      });
    }

    next();
  };
};
