const Profile = require('../models/Profile');

const profileController = {
  createProfile: async (req, res) => {
    try {
      const userId = req.user.id; // Récupéré depuis le middleware d'authentification Supabase
      const profileData = {
        user_id: userId,
        ...req.body,
      };

      Profile.create(profileData, (error, profile) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.status(201).json(profile);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      Profile.getByUserId(userId, (error, profile) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        if (!profile) {
          return res.status(404).json({ error: 'Profil non trouvé' });
        }
        res.json(profile);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      // Récupérer d'abord le profil pour vérifier l'appartenance
      Profile.getByUserId(userId, async (error, profile) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        if (!profile) {
          return res.status(404).json({ error: 'Profil non trouvé' });
        }

        // Mettre à jour le profil
        Profile.update(profile.id, req.body, (updateError, updatedProfile) => {
          if (updateError) {
            return res.status(500).json({ error: updateError.message });
          }
          res.json(updatedProfile);
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updatePhoto: async (req, res) => {
    try {
      const userId = req.user.id;
      const { photoUrl } = req.body;

      // Récupérer d'abord le profil pour vérifier l'appartenance
      Profile.getByUserId(userId, async (error, profile) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        if (!profile) {
          return res.status(404).json({ error: 'Profil non trouvé' });
        }

        Profile.updatePhoto(profile.id, photoUrl, (updateError, updatedProfile) => {
          if (updateError) {
            return res.status(500).json({ error: updateError.message });
          }
          res.json(updatedProfile);
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mettre à jour l'étape d'objectifs santé
  updateObjectifsSante: (req, res) => {
    const profileId = req.params.id;
    const { objectif_sante } = req.body;

    if (!objectif_sante) {
      return res.status(400).json({
        success: false,
        message: "L'objectif santé est obligatoire",
      });
    }

    Profile.update(profileId, { objectif_sante }, (err, updatedProfile) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de la mise à jour des objectifs santé',
          error: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Objectifs santé mis à jour avec succès',
        data: updatedProfile,
      });
    });
  },

  // Mettre à jour l'étape de régime particulier
  updateRegimeParticulier: (req, res) => {
    const profileId = req.params.id;
    const { regime_particulier, autres_regimes } = req.body;

    Profile.update(
      profileId,
      {
        regime_particulier,
        autres_regimes,
      },
      (err, updatedProfile) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du régime particulier',
            error: err.message,
          });
        }

        res.status(200).json({
          success: true,
          message: 'Régime particulier mis à jour avec succès',
          data: updatedProfile,
        });
      }
    );
  },

  // Mettre à jour l'étape de données physiques
  updateDonneesPhysiques: (req, res) => {
    const profileId = req.params.id;
    const { sexe, age, taille, poids } = req.body;

    // Validation de base
    if (!sexe || !age || !taille || !poids) {
      return res.status(400).json({
        success: false,
        message: 'Toutes les données physiques sont obligatoires',
      });
    }

    Profile.update(
      profileId,
      {
        sexe,
        age: parseInt(age, 10),
        taille: parseInt(taille, 10),
        poids: parseInt(poids, 10),
      },
      (err, updatedProfile) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des données physiques',
            error: err.message,
          });
        }

        res.status(200).json({
          success: true,
          message: 'Données physiques mises à jour avec succès',
          data: updatedProfile,
        });
      }
    );
  },

  // Mettre à jour l'étape de budget alimentaire
  updateBudget: (req, res) => {
    const profileId = req.params.id;
    const { budget_alimentaire } = req.body;

    if (budget_alimentaire === undefined || budget_alimentaire === null) {
      return res.status(400).json({
        success: false,
        message: 'Le budget alimentaire est obligatoire',
      });
    }

    Profile.update(
      profileId,
      {
        budget_alimentaire: parseInt(budget_alimentaire, 10),
      },
      (err, updatedProfile) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du budget alimentaire',
            error: err.message,
          });
        }

        res.status(200).json({
          success: true,
          message: 'Budget alimentaire mis à jour avec succès',
          data: updatedProfile,
        });
      }
    );
  },

  // Mettre à jour l'étape de freemium
  updateFreemium: (req, res) => {
    const profileId = req.params.id;
    const { freemium } = req.body;

    if (freemium === undefined || freemium === null) {
      return res.status(400).json({
        success: false,
        message: "L'option freemium est obligatoire",
      });
    }

    Profile.update(
      profileId,
      {
        freemium: freemium ? 1 : 0,
        completed: 1, // Marquer l'onboarding comme terminé
      },
      (err, updatedProfile) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des options freemium',
            error: err.message,
          });
        }

        res.status(200).json({
          success: true,
          message: 'Options freemium mises à jour avec succès',
          data: updatedProfile,
        });
      }
    );
  },
};

module.exports = profileController;
