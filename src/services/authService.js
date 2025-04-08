import { ApiService } from './api';

export const AuthService = {
  /**
   * S'inscrire avec un email et un mot de passe
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @param {string} prenom - Prénom de l'utilisateur
   * @returns {Promise} Promesse avec les données de l'utilisateur créé
   */
  register: async (email, password, prenom) => {
    try {
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, prenom }),
      });

      // Vérifier si le serveur a répondu
      if (!response) {
        throw new Error(
          "Aucune réponse du serveur. Vérifiez que le serveur est en cours d'exécution."
        );
      }

      let data;
      try {
        // Essayer de parser le JSON de façon sécurisée
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        throw new Error(
          'Réponse invalide du serveur. Vérifiez que le serveur est correctement configuré.'
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // Stocker l'utilisateur dans le localStorage pour garder la session
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('profile', JSON.stringify(data.data.profile));
      }

      return data;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    }
  },

  /**
   * Se connecter avec un email et un mot de passe
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise} Promesse avec les données de l'utilisateur connecté
   */
  login: async (email, password) => {
    try {
      console.log(`Tentative de connexion pour l'email: ${email}`);

      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Vérifier si le serveur a répondu
      if (!response) {
        console.error('Aucune réponse du serveur');
        throw new Error(
          "Aucune réponse du serveur. Vérifiez que le serveur est en cours d'exécution."
        );
      }

      console.log('Réponse du serveur reçue:', response.status, response.statusText);

      let data;
      try {
        // Essayer de parser le JSON de façon sécurisée
        const text = await response.text();
        console.log('Réponse brute:', text);
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        throw new Error(
          'Réponse invalide du serveur. Vérifiez que le serveur est correctement configuré.'
        );
      }

      if (!response.ok) {
        console.error('Erreur de connexion:', data);
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      console.log('Connexion réussie:', data);

      // Stocker l'utilisateur dans le localStorage pour garder la session
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('profile', JSON.stringify(data.data.profile));
      }

      return data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    window.location.href = '/login';
  },

  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} Vrai si l'utilisateur est connecté
   */
  isAuthenticated: () => {
    return localStorage.getItem('user') !== null;
  },

  /**
   * Obtenir l'utilisateur connecté
   * @returns {Object|null} Données de l'utilisateur ou null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  },

  /**
   * Obtenir le profil de l'utilisateur connecté
   * @returns {Object|null} Données du profil ou null
   */
  getCurrentProfile: () => {
    const profileStr = localStorage.getItem('profile');
    if (!profileStr) return null;
    try {
      return JSON.parse(profileStr);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  },

  /**
   * Mettre à jour le profil de l'utilisateur dans le localStorage
   * @param {Object} profile - Nouvelles données du profil
   */
  updateProfile: (profile) => {
    localStorage.setItem('profile', JSON.stringify(profile));
  },
};
