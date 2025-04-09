const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/auth');

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

// Créer un nouveau profil
router.post('/', profileController.createProfile);

// Récupérer le profil de l'utilisateur connecté
router.get('/', profileController.getProfile);

// Mettre à jour le profil
router.put('/', profileController.updateProfile);

// Mettre à jour la photo de profil
router.put('/photo', profileController.updatePhoto);

// Routes spécifiques pour l'onboarding
router.put('/objectifs-sante', profileController.updateObjectifsSante);
router.put('/regime-particulier', profileController.updateRegimeParticulier);
router.put('/donnees-physiques', profileController.updateDonneesPhysiques);
router.put('/budget', profileController.updateBudget);
router.put('/freemium', profileController.updateFreemium);

module.exports = router;
