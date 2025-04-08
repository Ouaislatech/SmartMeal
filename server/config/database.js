const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données
const dbPath = path.resolve(__dirname, '../../database/smartmeal.db');

// Instance de base de données
let db = null;

// Fonction d'initialisation de la base de données
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('Initialisation de la base de données...');

    // Créer une nouvelle instance de base de données
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Erreur de connexion à la base de données:', err.message);
        return reject(err);
      }

      console.log('Connecté à la base de données SQLite');

      // Créer les tables nécessaires
      db.serialize(() => {
        db.run(
          `
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            prenom TEXT,
            hashed_password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
          `,
          (err) => {
            if (err) {
              console.error('Erreur lors de la création de la table users:', err);
              return reject(err);
            }
            console.log('Table users créée ou déjà existante');
          }
        );

        db.run(
          `
          CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            prenom TEXT,
            objectif_sante TEXT,
            regime_particulier TEXT,
            autres_regimes TEXT,
            sexe TEXT,
            age INTEGER,
            taille INTEGER,
            poids INTEGER,
            budget_alimentaire INTEGER,
            freemium INTEGER DEFAULT 0,
            completed INTEGER DEFAULT 0,
            photo_profil TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
          `,
          (err) => {
            if (err) {
              console.error('Erreur lors de la création de la table profiles:', err);
              return reject(err);
            }
            console.log('Table profiles créée ou déjà existante');
            resolve(db);
          }
        );
      });
    });
  });
};

// Exporter l'instance de la base de données et la fonction d'initialisation
module.exports = {
  getDb: () => {
    if (!db) {
      console.warn('Attention: La base de données est accédée avant son initialisation');
    }
    return db;
  },
  initializeDatabase: async () => {
    if (!db) {
      db = await initializeDatabase();
    }
    return db;
  },
};
