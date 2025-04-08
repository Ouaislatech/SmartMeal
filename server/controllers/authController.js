const User = require('../models/User');
const Profile = require('../models/Profile');

/**
 * Contrôleur pour les routes d'authentification
 */
const authController = {
  /**
   * Enregistre un nouvel utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  register: (req, res) => {
    const { email, password, prenom } = req.body;

    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis',
      });
    }

    User.create({ email, password, prenom }, (err, userId) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Erreur lors de la création du compte',
        });
      }

      // Créer un profil vide pour l'utilisateur
      Profile.create({ user_id: userId, prenom }, (errProfile, profileId) => {
        if (errProfile) {
          console.error('Erreur lors de la création du profil:', errProfile);
        }

        // Récupérer l'utilisateur créé
        User.getById(userId, (errUser, user) => {
          if (errUser) {
            return res.status(500).json({
              success: false,
              message: 'Utilisateur créé, mais erreur lors de la récupération des données',
            });
          }

          // Récupérer le profil créé
          Profile.getByUserId(userId, (errUserProfile, profile) => {
            res.status(201).json({
              success: true,
              message: 'Utilisateur créé avec succès',
              data: {
                user: {
                  id: user.id,
                  email: user.email,
                  prenom: user.prenom,
                },
                profile: profile || null,
              },
            });
          });
        });
      });
    });
  },

  // Connexion
  login: (req, res) => {
    const { email, password } = req.body;

    // Validation de base
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont obligatoires',
      });
    }

    User.authenticate(email, password, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Erreur lors de l'authentification",
          error: err.message,
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect',
        });
      }

      // Récupérer le profil
      Profile.getByUserId(user.id, (err, profile) => {
        // Renvoyer l'utilisateur et son profil
        res.status(200).json({
          success: true,
          message: 'Connexion réussie',
          data: {
            user,
            profile: profile || null,
            // On pourrait ajouter un token JWT ici plus tard
          },
        });
      });
    });
  },

  // Vérifier l'état de l'utilisateur
  checkUser: (req, res) => {
    const userId = req.params.id;

    User.getById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la récupération de l'utilisateur",
          error: err.message,
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      }

      // Ne pas renvoyer le mot de passe haché
      const { hashed_password, ...userWithoutPassword } = user;

      // Récupérer le profil
      Profile.getByUserId(userId, (err, profile) => {
        res.status(200).json({
          success: true,
          data: {
            user: userWithoutPassword,
            profile: profile || null,
          },
        });
      });
    });
  },
};

module.exports = authController;
