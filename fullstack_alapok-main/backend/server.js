// Függőségek importálása
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); // CORS csomag importálása

// Express alkalmazás inicializálása
const app = express();

// CORS middleware engedélyezése minden kérésre
app.use(cors());

// JSON body parser beállítása
app.use(express.json());

// Port beállítása a környezeti változóból vagy alapértelmezett értékkel
const PORT = process.env.PORT || 3001;

// MySQL kapcsolat létrehozása (Connection Pool)
const dbPool = mysql.createPool({
    host: 'localhost',      // Adatbázis szerver címe   
    user: 'root',         // Adatbázis felhasználónév
    password: '', // Adatbázis jelszó
    database: 'users', // Adatbázis név   
    port: 3307,            // Adatbázis port
});

// Alap útvonal (route)
app.get('/', (req, res) => {
  res.send('Hello, a backend szerver fut!');
});

// Adatbázis kapcsolat tesztelése
app.get('/ping', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Sikeres adatbázis kapcsolat!', result: rows[0].solution });
  } catch (error) {
    console.error('Hiba az adatbázis-kapcsolat során:', error);
    res.status(500).json({ message: 'Hiba az adatbázis-kapcsolat során.' });
  }
});


// --- API VÉGPONTOK (CRUD) ---

// READ (GET): Minden felhasználó lekérdezése
app.get('/api/users', async (req, res) => {
    try {
        const sqlQuery = "SELECT id, name, email, created_at FROM users";
        const [rows] = await dbPool.query(sqlQuery);
        res.json(rows);
    } catch (error) {
        console.error("Hiba a lekérdezés során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a lekérdezéskor.' });
    }
});

// CREATE (POST): Új felhasználó hozzáadása
app.post('/api/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
        const [result] = await dbPool.query(sql, [name, email]);
        res.status(201).json({ message: "Felhasználó sikeresen hozzáadva", id: result.insertId });
    } catch (error) {
        console.error("Hiba a beszúrás során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a beszúráskor.' });
    }
});

// UPDATE (PATCH): Felhasználó adatainak módosítása ID alapján
app.patch('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'A név és az email mező kitöltése kötelező a módosításhoz.' });
        }

        const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
        const [result] = await dbPool.query(sql, [name, email, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A felhasználó nem található.' });
        }
        res.json({ message: "Felhasználó sikeresen módosítva", id: id });
    } catch (error) {
        console.error("Hiba a módosítás során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a módosításkor.' });
    }
});

// DELETE (DELETE): Felhasználó törlése ID alapján
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM users WHERE id = ?";
        const [result] = await dbPool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A felhasználó nem található.' });
        }
        res.json({ message: "Felhasználó sikeresen törölve", id: id });
    } catch (error) {
        console.error("Hiba a törlés során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a törléskor.' });
    }
});


// Szerver indítása
app.listen(PORT, () => {
  console.log(`A szerver fut a http://localhost:${PORT} címen`);
});
