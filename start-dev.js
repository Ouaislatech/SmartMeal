/**
 * Script pour démarrer l'application en mode développement
 * Permet de s'assurer que le dossier de la base de données existe
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Créer le dossier de base de données s'il n'existe pas
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  console.log('Création du dossier de base de données...');
  fs.mkdirSync(dbDir);
}

// Lancer le script "dev:all" de package.json
console.log("Démarrage de l'application SmartMeal...");
console.log('Le frontend sera disponible sur http://localhost:3000');
console.log("L'API sera disponible sur http://localhost:5001");

const startProcess = spawn('npm', ['run', 'dev:all'], {
  stdio: 'inherit',
  shell: true,
});

startProcess.on('error', (err) => {
  console.error("Erreur au démarrage de l'application:", err);
});

// Gérer le CTRL+C proprement
process.on('SIGINT', () => {
  console.log("\nArrêt de l'application...");
  startProcess.kill('SIGINT');
  process.exit(0);
});
