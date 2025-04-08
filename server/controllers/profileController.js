const Profile = require('../models/Profile');

// Récupérer le profil d'un utilisateur
exports.getProfile = (req, res) => {
  const userId = req.params.userId;

  Profile.getByUserId(userId, (err, profile) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil',
        error: err.message,
      });
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profil non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  });
};

// Mettre à jour un profil
exports.updateProfile = (req, res) => {
  const profileId = req.params.id;
  const profileData = req.body;

  Profile.update(profileId, profileData, (err, updatedProfile) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du profil',
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: updatedProfile,
    });
  });
};

// Mettre à jour l'étape d'objectifs santé
exports.updateObjectifsSante = (req, res) => {
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
};

// Mettre à jour l'étape de régime particulier
exports.updateRegimeParticulier = (req, res) => {
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
};

// Mettre à jour l'étape de données physiques
exports.updateDonneesPhysiques = (req, res) => {
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
};

// Mettre à jour l'étape de budget alimentaire
exports.updateBudget = (req, res) => {
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
};

// Mettre à jour l'étape de freemium
exports.updateFreemium = (req, res) => {
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
};

/**
 * Met à jour la photo de profil
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.updatePhoto = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { photo_profil } = req.body;

    if (!photo_profil) {
      return res.status(400).json({ message: 'URL de la photo manquante' });
    }

    const updatedProfile = await Profile.update(profileId, { photo_profil });
    res.json(updatedProfile);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo' });
  }
};
