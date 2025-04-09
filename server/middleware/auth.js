const { supabase } = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token d'authentification manquant" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Format de token invalide' });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // Ajouter l'utilisateur à la requête pour les routes suivantes
    req.user = user;
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    res.status(500).json({ error: "Erreur lors de la vérification de l'authentification" });
  }
};

module.exports = { authMiddleware };
