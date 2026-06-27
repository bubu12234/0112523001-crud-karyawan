/**
 * Seed script: buat tiga akun uji (admin, operator, viewer).
 * Jalankan dengan: npx ts-node seed-users.ts
 *
 * Script ini aman dijalankan berulang kali karena menggunakan INSERT IGNORE.
 */
import bcrypt from "bcrypt";
import db from "./src/config/database";

const users = [
  {
    name: "Admin Sistem",
    email: "admin@kampus.ac.id",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Operator Data",
    email: "operator@kampus.ac.id",
    password: "operator123",
    role: "operator",
  },
  {
    name: "Viewer Tamu",
    email: "viewer@kampus.ac.id",
    password: "viewer123",
    role: "viewer",
  },
];

async function seed() {
  try {
    console.log("Memulai seed akun uji...\n");

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const [result]: any = await db.query(
        `INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [user.name, user.email, hashedPassword, user.role]
      );

      if (result.affectedRows > 0) {
        console.log(`✓ Berhasil: [${user.role}] ${user.email} (password: ${user.password})`);
      } else {
        console.log(`- Sudah ada: [${user.role}] ${user.email} (dilewati)`);
      }
    }

    console.log("\nSeed selesai!");
    process.exit(0);
  } catch (err) {
    console.error("Seed gagal:", err);
    process.exit(1);
  }
}

seed();
