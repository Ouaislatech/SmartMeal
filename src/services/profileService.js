import axios from 'axios';
import { AuthService } from './authService';

const API_URL = '/api';

export const ProfileService = {
  /**
   * Récupérer le profil d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise} Promesse avec les données du profil
   */
  getProfile: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/profiles/user/${userId}`);
      return response.data;
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
      const response = await axios.put(`${API_URL}/profiles/${profileId}`, profileData);
      return response.data;
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
      const response = await axios.put(`${API_URL}/profiles/${profileId}/objectifs-sante`, {
        objectif_sante: objectifSante,
      });
      return response.data;
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
      const response = await axios.put(`${API_URL}/profiles/${profileId}/regime-particulier`, {
        regime_particulier: regimeData.regime_particulier,
        autres_regimes: regimeData.autres_regimes,
      });
      return response.data;
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
      const response = await axios.put(`${API_URL}/profiles/${profileId}/donnees-physiques`, {
        sexe: donneesPhysiques.sexe,
        age: donneesPhysiques.age,
        taille: donneesPhysiques.taille,
        poids: donneesPhysiques.poids,
      });
      return response.data;
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
      const response = await axios.put(`${API_URL}/profiles/${profileId}/budget`, {
        budget_alimentaire: budgetAlimentaire,
      });
      return response.data;
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
      const response = await axios.put(`${API_URL}/profiles/${profileId}/freemium`, {
        freemium,
      });
      return response.data;
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
      const response = await axios.put(`${API_URL}/profiles/${profileId}/photo`, {
        photo_profil: photoUrl,
      });

      // Mettre à jour le profil dans le localStorage
      const user = AuthService.getUser();
      if (user) {
        user.profile = response.data;
        AuthService.setUser(user);
      }

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo:', error);
      throw error;
    }
  },
};
