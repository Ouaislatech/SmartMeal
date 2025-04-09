const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./config/database');

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const mealRoutes = require('./routes/generateMeals');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());

// Configuration pour augmenter la limite de taille des requêtes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialisation de la base de données
initializeDatabase()
  .then((db) => {
    console.log('Base de données initialisée avec succès:', db ? 'OK' : 'Erreur');

    // Routes API
    app.use('/api/users', userRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/profiles', profileRoutes);
    app.use('/api/meals', mealRoutes);

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });

    // Route pour le statut de l'API
    app.get('/api/status', (req, res) => {
      res.json({ status: 'API opérationnelle', timestamp: new Date() });
    });

    // En production, servir les fichiers statiques du frontend
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../dist')));

      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist', 'index.html'));
      });
    }
  })
  .catch((err) => {
    console.error("Erreur lors de l'initialisation de la base de données:", err);
    process.exit(1);
  });
