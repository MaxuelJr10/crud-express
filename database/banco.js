const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./database/banco.db",
  (erro) => {
    if (erro) {
      console.error("Erro ao conectar ao banco:", erro.message);
    } else {
      console.log("Banco de dados conectado.");
    }
  }
);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      valor REAL NOT NULL,
      quantidade INTEGER NOT NULL,
      cor TEXT
    )
  `);
});

module.exports = db;
