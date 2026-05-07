const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const app = express();

app.use(express.json()); // Bu sətir gələn kitab məlumatını oxumaq üçün mütləqdir!

const db = new sqlite3.Database('./library.db');

db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    year INTEGER
)`);

// GET - Kitabları görmək üçün
app.get('/api/books', (req, res) => {
    db.all("SELECT * FROM books", [], (err, rows) => {
        res.json(rows);
    });
});

// POST - Kitab əlavə etmək üçün
app.post('/api/books', (req, res) => {
    const { title, author, year } = req.body;
    db.run('INSERT INTO books (title, author, year) VALUES (?, ?, ?)', [title, author, year], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Kitab uğurla əlavə edildi!", id: this.lastID });
    });
});

app.listen(3000, () => {
    console.log("SERVER HAZIRDIR: http://localhost:3000");
});