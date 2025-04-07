const User = require("../models/User");

// Créer un nouvel utilisateur
exports.createUser = (req, res) => {
  const userData = {
    prenom: req.body.prenom,
    objectif: req.body.objectif,
    allergies: req.body.allergies || "",
    preferences: req.body.preferences || "",
  };

  // Validation de base
  if (!userData.prenom || !userData.objectif) {
    return res.status(400).json({
      success: false,
      message: "Le prénom et l'objectif sont obligatoires",
    });
  }

  User.create(userData, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de l'utilisateur",
        error: err.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: user,
    });
  });
};

// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des utilisateurs",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  });
};

// Récupérer un utilisateur par son ID
exports.getUserById = (req, res) => {
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
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  });
};
