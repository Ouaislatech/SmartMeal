const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Chemin vers la base de données
const dbPath = path.resolve(__dirname, "../../database/smartmeal.db");

// Créer une nouvelle instance de base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err.message);
  } else {
    console.log("Connecté à la base de données SQLite");

    // Créer la table users si elle n'existe pas
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prenom TEXT NOT NULL,
        objectif TEXT NOT NULL,
        allergies TEXT,
        preferences TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          console.error(
            "Erreur lors de la création de la table users:",
            err.message
          );
        } else {
          console.log("Table users créée ou déjà existante");
        }
      }
    );
  }
});

module.exports = db;
