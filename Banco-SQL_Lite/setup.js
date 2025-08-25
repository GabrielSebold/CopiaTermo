const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./palavras.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS palavras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    palavra TEXT NOT NULL
  )`);
});

db.close();