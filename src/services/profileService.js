import { supabase } from './supabaseClient';
import { AuthService } from './authService';

export const ProfileService = {
  /**
   * Récupérer le profil d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise} Promesse avec les données du profil
   */
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour le profil
   * @param {number} profileId - ID du profil
   * @param {Object} profileData - Données du profil
   * @returns {Promise} Promesse avec les données du profil mis à jour
   */
  updateProfile: async (profileId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour l'étape d'objectifs santé
   * @param {number} profileId - ID du profil
   * @param {string} objectifSante - Objectif santé sélectionné
   * @returns {Promise} Promesse avec les données du profil mis à jour
   */
  updateObjectifsSante: async (profileId, objectifSante) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ objectif_sante: objectifSante })
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des objectifs santé:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour l'étape de régime particulier
   * @param {number} profileId - ID du profil
   * @param {Object} regimeData - Données de régime particulier
   * @returns {Promise} Promesse avec les données du profil mis à jour
   */
  updateRegimeParticulier: async (profileId, regimeData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          regime_particulier: regimeData.regime_particulier,
          autres_regimes: regimeData.autres_regimes,
        })
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du régime particulier:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour l'étape de données physiques
   * @param {number} profileId - ID du profil
   * @param {Object} donneesPhysiques - Données physiques
   * @returns {Promise} Promesse avec les données du profil mis à jour
   */
  updateDonneesPhysiques: async (profileId, donneesPhysiques) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          sexe: donneesPhysiques.sexe,
          age: donneesPhysiques.age,
          taille: donneesPhysiques.taille,
          poids: donneesPhysiques.poids,
        })
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données physiques:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour l'étape de budget alimentaire
   * @param {number} profileId - ID du profil
   * @param {number} budgetAlimentaire - Budget alimentaire
   * @returns {Promise} Promesse avec les données du profil mis à jour
   */
  updateBudget: async (profileId, budgetAlimentaire) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          budget_alimentaire: budgetAlimentaire,
        })
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du budget:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour l'étape de freemium
   * @param {number} profileId - ID du profil
   * @param {boolean} freemium - Option freemium
   * @returns {Promise} Promesse avec les données du profil mis à jour
   */
  updateFreemium: async (profileId, freemium) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ freemium })
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut freemium:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour la photo de profil
   * @param {number} profileId - ID du profil
   * @param {string} photoUrl - URL de la photo de profil
   * @returns {Promise} Promesse avec les données du profil mis à jour
   */
  updatePhoto: async (profileId, photoUrl) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          photo_profil: photoUrl,
        })
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le profil dans le localStorage
      const user = AuthService.getUser();
      if (user) {
        user.profile = data;
        AuthService.setUser(user);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo:', error);
      throw error;
    }
  },
};
