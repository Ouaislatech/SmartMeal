const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Routes
const userRoutes = require("./routes/userRoutes");

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes API
app.use("/api/users", userRoutes);

// Route pour le statut de l'API
app.get("/api/status", (req, res) => {
  res.json({ status: "API opérationnelle", timestamp: new Date() });
});

// En production, servir les fichiers statiques du frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  });
}

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
