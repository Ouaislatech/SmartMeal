const db = require('../config/database');

class Profile {
  static create(profileData, callback) {
    const {
      user_id,
      prenom = null,
      objectif_sante = null,
      regime_particulier = null,
      autres_regimes = null,
      sexe = null,
      age = null,
      taille = null,
      poids = null,
      budget_alimentaire = null,
      freemium = true,
      completed = false,
      allergies = null,
      preferences = null,
    } = profileData;

    const sql = `
      INSERT INTO profiles (
        user_id, prenom, objectif_sante, regime_particulier, autres_regimes, 
        sexe, age, taille, poids, budget_alimentaire, freemium, completed,
        allergies, preferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [
        user_id,
        prenom,
        objectif_sante,
        regime_particulier,
        autres_regimes,
        sexe,
        age,
        taille,
        poids,
        budget_alimentaire,
        freemium ? 1 : 0,
        completed ? 1 : 0,
        allergies,
        preferences,
      ],
      function (err) {
        if (err) {
          return callback(err, null);
        }

        callback(null, {
          id: this.lastID,
          user_id,
          prenom,
          objectif_sante,
          regime_particulier,
          autres_regimes,
          sexe,
          age,
          taille,
          poids,
          budget_alimentaire,
          freemium,
          completed,
          allergies,
          preferences,
        });
      }
    );
  }

  static getByUserId(userId, callback) {
    const sql = 'SELECT * FROM profiles WHERE user_id = ?';

    console.log(db);

    db.get(sql, [userId], (err, row) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, row);
    });
  }

  static update(profileId, profileData, callback) {
    // Construire dynamiquement la requête SQL d'update
    let updates = [];
    let values = [];

    for (const [key, value] of Object.entries(profileData)) {
      if (key !== 'id' && key !== 'user_id' && key !== 'created_at') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    // Ajouter updated_at
    updates.push('updated_at = CURRENT_TIMESTAMP');

    // Ajouter l'ID à la fin des valeurs pour la clause WHERE
    values.push(profileId);

    const sql = `
      UPDATE profiles
      SET ${updates.join(', ')}
      WHERE id = ?
    `;

    db.run(sql, values, function (err) {
      if (err) {
        return callback(err, null);
      }

      if (this.changes === 0) {
        return callback(new Error('Profil non trouvé'), null);
      }

      // Récupérer le profil mis à jour
      db.get('SELECT * FROM profiles WHERE id = ?', [profileId], (err, row) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, row);
      });
    });
  }

  static delete(profileId, callback) {
    const sql = 'DELETE FROM profiles WHERE id = ?';

    db.run(sql, [profileId], function (err) {
      if (err) {
        return callback(err, null);
      }

      callback(null, { deleted: this.changes > 0 });
    });
  }

  static updatePhoto(profileId, photoUrl, callback) {
    db.run(
      'UPDATE profiles SET photo_profil = ? WHERE id = ?',
      [photoUrl, profileId],
      function (err) {
        if (err) {
          return callback(err);
        }

        // Récupérer le profil mis à jour
        Profile.getById(profileId, callback);
      }
    );
  }
}

module.exports = Profile;
