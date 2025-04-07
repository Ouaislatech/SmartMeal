const db = require("../config/database");

class User {
  static create(userData, callback) {
    const { prenom, objectif, allergies, preferences } = userData;

    const sql = `
      INSERT INTO users (prenom, objectif, allergies, preferences)
      VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [prenom, objectif, allergies, preferences], function (err) {
      if (err) {
        return callback(err, null);
      }

      callback(null, {
        id: this.lastID,
        prenom,
        objectif,
        allergies,
        preferences,
      });
    });
  }

  static getAll(callback) {
    const sql = "SELECT * FROM users";

    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, rows);
    });
  }

  static getById(id, callback) {
    const sql = "SELECT * FROM users WHERE id = ?";

    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, row);
    });
  }
}

module.exports = User;
