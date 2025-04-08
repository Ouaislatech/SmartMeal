const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour l'inscription
router.post('/register', authController.register);

// Route pour la connexion
router.post('/login', authController.login);

// Route pour vérifier un utilisateur
router.get('/user/:id', authController.checkUser);

module.exports = router;
