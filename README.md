<<<<<<< HEAD
# SmartMeal
=======
# SmartMeal

Application de nutrition personnalisée fonctionnant entièrement en local.

## Technologies utilisées

- **Frontend**: React avec Vite
- **Backend**: Node.js avec Express
- **Base de données**: SQLite (locale)

## Structure du projet

- `/src` (frontend React)
- `/server` (backend Node.js/Express)
- `/database` (base de données SQLite)

## Installation

```bash
# Installer les dépendances
npm install
```

## Démarrage de l'application

La façon la plus simple de démarrer l'application est d'utiliser:

```bash
# Démarre toute l'application (frontend + backend)
npm start
```

Alternativement, vous pouvez démarrer les composants séparément:

```bash
# Démarrer le frontend et le backend simultanément
npm run dev:all

# Démarrer seulement le frontend
npm run dev

# Démarrer seulement le backend
npm run server
```

## Accès à l'application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api

## Fonctionnalités

- Formulaire d'onboarding pour recueillir les informations utilisateur
- Stockage des données dans une base SQLite locale
- API REST pour la communication entre le frontend et le backend
- Affichage des profils utilisateurs enregistrés

## Développement futur

Cette application est conçue pour évoluer avec les fonctionnalités suivantes:

- Création de plans de repas
- Génération de listes de courses
- Intégration d'IA pour des recommandations personnalisées
>>>>>>> 8dc70f2 (Initialisation du projet SmartMeal)
