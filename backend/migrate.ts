import db from "./src/config/database";

async function migrate() {
  try {
    console.log("Creating prodi table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS prodi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_prodi VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    console.log("Inserting prodi data...");
    await db.query(`
      INSERT IGNORE INTO prodi (nama_prodi) VALUES
      ('Informatika'),
      ('Sistem Informasi'),
      ('Teknik Elektro'),
      ('Manajemen'),
      ('Akuntansi');
    `);

    console.log("Checking if mahasiswa table exists...");
    
    // We will drop the old mahasiswa table and create a new one to match the requirement exactly
    await db.query("DROP TABLE IF EXISTS mahasiswa");

    console.log("Creating new mahasiswa table with prodi_id and foto...");
    await db.query(`
      CREATE TABLE mahasiswa (
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

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
