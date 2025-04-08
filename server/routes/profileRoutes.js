const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route pour récupérer le profil d'un utilisateur
router.get('/user/:userId', profileController.getProfile);

// Route pour mettre à jour un profil
router.put('/:id', profileController.updateProfile);

// Routes pour les étapes d'onboarding
router.put('/:id/objectifs-sante', profileController.updateObjectifsSante);
router.put('/:id/regime-particulier', profileController.updateRegimeParticulier);
router.put('/:id/donnees-physiques', profileController.updateDonneesPhysiques);
router.put('/:id/budget', profileController.updateBudget);
router.put('/:id/freemium', profileController.updateFreemium);
router.put('/:id/photo', profileController.updatePhoto);

module.exports = router;
