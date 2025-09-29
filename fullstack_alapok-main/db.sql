-- Kérlek, futtasd ezt a kódot a MySQL kliensedben!

-- 1. LÉPÉS: Hozd létre az adatbázist, ha még nem létezik.
CREATE DATABASE IF NOT EXISTS users CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. LÉPÉS: Válaszd ki az újonnan létrehozott adatbázist.
USE users;

-- 3. LÉPÉS: Hozd létre a `users` táblát.
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- 4. LÉPÉS: Töltsd fel a táblát néhány mintaadattal.
INSERT INTO users (name, email) VALUES
('Tóth János', 'janos.toth@example.com'),
('Nagy Mária', 'maria.nagy@example.com'),
('Kiss Géza', 'geza.kiss@example.com')
ON DUPLICATE KEY UPDATE name=name;

-- 5. LÉPÉS (Ellenőrzés): Kérdezd le az összes adatot a táblából.
SELECT * FROM users;