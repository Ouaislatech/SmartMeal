const { getDb } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Crée un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @param {string} userData.email - Email de l'utilisateur
   * @param {string} userData.password - Mot de passe en clair
   * @param {string} userData.prenom - Prénom de l'utilisateur
   * @param {function} callback - Fonction de callback (err, userId)
   */
  static create(userData, callback) {
    const { email, password, prenom } = userData;
    const db = getDb();

    // Vérifier si l'email existe déjà
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return callback(err);
      }

      if (row) {
        return callback(new Error('Cet email est déjà utilisé'));
      }

      try {
        // Hacher le mot de passe
        const hashedPassword = await User.hashPassword(password);

        // Insérer le nouvel utilisateur
        db.run(
          'INSERT INTO users (email, hashed_password, prenom) VALUES (?, ?, ?)',
          [email, hashedPassword, prenom || null],
          function (err) {
            if (err) {
              return callback(err);
            }

            callback(null, this.lastID);
          }
        );
      } catch (error) {
        callback(error);
      }
    });
  }

  static getByEmail(email, callback) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const db = getDb();

    db.get(sql, [email], (err, row) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, row);
    });
  }

  static getById(id, callback) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const db = getDb();

    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, row);
    });
  }

  static authenticate(email, password, callback) {
    console.log(`Tentative d'authentification pour l'email: ${email}`);

    this.getByEmail(email, async (err, user) => {
      if (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        return callback(err, null);
      }

      if (!user) {
        console.log(`Utilisateur non trouvé pour l'email: ${email}`);
        return callback(null, false);
      }

      try {
        console.log('Utilisateur trouvé, vérification du mot de passe...');
        const isMatch = await this.comparePassword(password, user.hashed_password);

        if (isMatch) {
          console.log(`Authentification réussie pour l'utilisateur: ${user.id}`);
          // Ne pas retourner le mot de passe haché
          const { hashed_password, ...userWithoutPassword } = user;
          return callback(null, userWithoutPassword);
        } else {
          console.log(`Mot de passe incorrect pour l'utilisateur: ${user.id}`);
          return callback(null, false);
        }
      } catch (error) {
        console.error('Erreur lors de la comparaison des mots de passe:', error);
        return callback(error, null);
      }
    });
  }

  static getAll(callback) {
    const sql = 'SELECT id, email, created_at FROM users';
    const db = getDb();

    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, rows);
    });
  }
}

module.exports = User;
