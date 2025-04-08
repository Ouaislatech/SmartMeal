import { supabase } from './supabaseClient';

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
      // Inscription avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message || "Erreur lors de l'inscription");
      }

      if (!authData.user) {
        throw new Error("Erreur lors de la création de l'utilisateur");
      }

      // Créer une entrée utilisateur dans la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: email,
            prenom: prenom,
          },
        ])
        .select()
        .single();

      if (userError) {
        throw new Error(userError.message || 'Erreur lors de la création du profil utilisateur');
      }

      // Créer un profil vide pour l'utilisateur
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: authData.user.id,
            prenom: prenom,
            completed: false,
            freemium: true,
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Erreur lors de la création du profil:', profileError);
      }

      // Stocker l'utilisateur dans le localStorage pour garder la session
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('profile', JSON.stringify(profileData));

      return {
        success: true,
        message: 'Utilisateur créé avec succès',
        data: {
          user: userData,
          profile: profileData,
        },
      };
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
      // Connexion avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message || 'Identifiants incorrects');
      }

      // Récupérer les données utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        throw new Error(
          userError.message || 'Erreur lors de la récupération des données utilisateur'
        );
      }

      // Récupérer le profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // Ignorer l'erreur si le profil n'existe pas
        console.error('Erreur lors de la récupération du profil:', profileError);
      }

      // Stocker l'utilisateur dans le localStorage pour garder la session
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('profile', JSON.stringify(profileData || null));

      return {
        success: true,
        message: 'Connexion réussie',
        data: {
          user: userData,
          profile: profileData || null,
        },
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }

      localStorage.removeItem('user');
      localStorage.removeItem('profile');
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  },

  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} Vrai si l'utilisateur est connecté
   */
  isAuthenticated: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      return false;
    }
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
