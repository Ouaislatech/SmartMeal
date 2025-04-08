const { supabase } = require('../config/supabase');
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

    // Vérifier si l'email existe déjà
    this.getByEmail(email, async (err, existingUser) => {
      if (err) {
        return callback(err);
      }

      if (existingUser) {
        return callback(new Error('Cet email est déjà utilisé'));
      }

      try {
        // Hacher le mot de passe
        const hashedPassword = await User.hashPassword(password);

        // Insérer le nouvel utilisateur dans Supabase
        const { data, error } = await supabase
          .from('users')
          .insert([{ email, hashed_password: hashedPassword, prenom: prenom || null }])
          .select()
          .single();

        if (error) {
          return callback(error);
        }

        callback(null, data.id);
      } catch (error) {
        callback(error);
      }
    });
  }

  static async getByEmail(email, callback) {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('email', email).single();

      if (error) {
        return callback(error, null);
      }

      callback(null, data);
    } catch (err) {
      callback(err, null);
    }
  }

  static async getById(id, callback) {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

      if (error) {
        return callback(error, null);
      }

      callback(null, data);
    } catch (err) {
      callback(err, null);
    }
  }

  static async authenticate(email, password, callback) {
    try {
      // Récupérer l'utilisateur par email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        return callback(error, null);
      }

      if (!user) {
        return callback(null, null);
      }

      // Vérifier le mot de passe
      const isPasswordValid = await User.comparePassword(password, user.hashed_password);

      if (!isPasswordValid) {
        return callback(null, null);
      }

      // Ne pas renvoyer le mot de passe haché
      const { hashed_password, ...userWithoutPassword } = user;
      callback(null, userWithoutPassword);
    } catch (err) {
      callback(err, null);
    }
  }

  static async getAll(callback) {
    try {
      const { data, error } = await supabase.from('users').select('id, email, created_at');

      if (error) {
        return callback(error, null);
      }

      callback(null, data);
    } catch (err) {
      callback(err, null);
    }
  }
}

module.exports = User;
