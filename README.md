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

## Configuration de Supabase

Cette application utilise Supabase comme base de données et pour l'authentification. Suivez ces étapes pour configurer Supabase :

1. Créez un compte sur [Supabase](https://supabase.com/) et créez un nouveau projet
2. Dans la section "SQL Editor", exécutez les scripts SQL suivants pour créer les tables nécessaires :

```sql
-- Table users (remplace la table SQLite)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  prenom TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table profiles (remplace la table SQLite)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  prenom TEXT,
  objectif_sante TEXT,
  regime_particulier TEXT,
  autres_regimes TEXT,
  sexe TEXT,
  age INTEGER,
  taille INTEGER,
  poids INTEGER,
  budget_alimentaire INTEGER,
  freemium BOOLEAN DEFAULT TRUE,
  completed BOOLEAN DEFAULT FALSE,
  photo_profil TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Créer une règle de sécurité RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour que les utilisateurs puissent accéder uniquement à leurs propres données
CREATE POLICY "Les utilisateurs peuvent voir leurs propres données"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent voir leurs propres profils"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres profils"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

3. Copiez le fichier `.env.example` en `.env` et remplissez-le avec vos informations Supabase

   - `SUPABASE_URL` : URL de votre projet Supabase (trouvable dans les paramètres du projet)
   - `SUPABASE_KEY` : Clé d'API de votre projet Supabase (clé secrète pour le backend)
   - `REACT_APP_SUPABASE_URL` : Même URL que ci-dessus
   - `REACT_APP_SUPABASE_KEY` : Clé anonyme (anon/public) pour le frontend

4. Redémarrez votre application pour utiliser Supabase au lieu de SQLite
