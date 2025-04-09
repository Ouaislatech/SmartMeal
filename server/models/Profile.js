const { supabase } = require('../config/supabase');

class Profile {
  static async create(profileData, callback) {
    const {
      user_id,
      prenom = '',
      objectif_sante = '',
      regime_particulier = '',
      autres_regimes = '',
      sexe = '',
      age = 0,
      taille = 0,
      poids = 0,
      budget_alimentaire = 0,
      freemium = true,
      completed = false,
      allergies = [],
      preferences = [],
    } = profileData;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
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
          },
        ])
        .select()
        .single();

      if (error) {
        return callback(error, null);
      }

      callback(null, data);
    } catch (err) {
      callback(err, null);
    }
  }

  static async getByUserId(userId, callback) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return callback(error, null);
      }

      callback(null, data);
    } catch (err) {
      callback(err, null);
    }
  }

  static async update(profileId, profileData, callback) {
    try {
      // Supprimer les champs qui ne doivent pas être mis à jour
      const { id, user_id, created_at, ...updateData } = profileData;

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profileId)
        .select()
        .single();

      if (error) {
        return callback(error, null);
      }

      if (!data) {
        return callback(new Error('Profil non trouvé'), null);
      }

      callback(null, data);
    } catch (err) {
      callback(err, null);
    }
  }

  static async delete(profileId, callback) {
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', profileId);

      if (error) {
        return callback(error, null);
      }

      callback(null, { deleted: true });
    } catch (err) {
      callback(err, null);
    }
  }

  static async updatePhoto(profileId, photoUrl, callback) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ photo_profil: photoUrl })
        .eq('id', profileId)
        .select()
        .single();

      if (error) {
        return callback(error, null);
      }

      callback(null, data);
    } catch (err) {
      callback(err, null);
    }
  }
}

module.exports = Profile;
