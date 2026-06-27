import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";
const dbName = process.env.DB_NAME || "db_praktikum";

let pool: mysql.Pool;

export async function initializeDatabase() {
  try {
    // 1. First connect without selecting a database to ensure it exists
    const tempConnection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
    });

    console.log("Menghubungkan ke MySQL server...");
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await tempConnection.end();

    // 2. Setup the actual pool with the database specified
    pool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // 3. Create tables if they do not exist
    console.log(`Menginisialisasi tabel untuk database '${dbName}'...`);
    
    // Prodi table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prodi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_prodi VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Insert prodi seed data
    await pool.query(`
      INSERT IGNORE INTO prodi (nama_prodi) VALUES
      ('Informatika'),
      ('Sistem Informasi'),
      ('Teknik Elektro'),
      ('Manajemen'),
      ('Akuntansi');
    `);

    // Mahasiswa table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mahasiswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nim VARCHAR(20) NOT NULL UNIQUE,
        nama VARCHAR(100) NOT NULL,
        prodi_id INT NOT NULL,
        angkatan INT NOT NULL,
        foto VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_mahasiswa_prodi
          FOREIGN KEY (prodi_id) REFERENCES prodi(id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);

    // Produk table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS produk (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        harga INT NOT NULL,
        stok INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'operator', 'viewer') NOT NULL DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    console.log("Database dan tabel siap digunakan.");
  } catch (error) {
    console.error("Gagal menginisialisasi database:", error);
    process.exit(1);
  }
}

// Export a helper to query
export async function query(sql: string, params?: any[]) {
  if (!pool) {
    throw new Error("Pool database belum diinisialisasi.");
  }
  const [results] = await pool.execute(sql, params);
  return results;
}

export default {
  initializeDatabase,
  query,
};
