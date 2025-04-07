// Utilisation du proxy Vite pour les requêtes API
const API_URL = '/api';

/**
 * Service pour gérer les appels API
 */
export const ApiService = {
  /**
   * Crée un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise} Promesse avec les données de l'utilisateur créé
   */
  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création de l'utilisateur");
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  /**
   * Récupère tous les utilisateurs
   * @returns {Promise} Promesse avec la liste des utilisateurs
   */
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des utilisateurs');
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  /**
   * Récupère un utilisateur par son ID
   * @param {number} id - ID de l'utilisateur
   * @returns {Promise} Promesse avec les données de l'utilisateur
   */
  getUserById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la récupération de l'utilisateur");
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  /**
   * Vérifie l'état de l'API
   * @returns {Promise} Promesse avec l'état de l'API
   */
  checkStatus: async () => {
    try {
      const response = await fetch(`${API_URL}/status`);
      return await response.json();
    } catch (error) {
      console.error("Erreur de connexion à l'API:", error);
      throw error;
    }
  },
};
