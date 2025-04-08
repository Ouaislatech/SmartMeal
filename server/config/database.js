// Ce fichier est conservé pour la compatibilité, mais n'est plus utilisé avec Supabase
console.log("SQLite n'est plus utilisé. Utilisation de Supabase à la place.");

// Fonction d'initialisation vide pour la compatibilité
const initializeDatabase = () => {
  return Promise.resolve(null);
};

// Fonction getDb vide pour la compatibilité
const getDb = () => {
  console.warn("Attention: getDb() appelé mais SQLite n'est plus utilisé");
  return null;
};

module.exports = {
  initializeDatabase,
  getDb,
};
