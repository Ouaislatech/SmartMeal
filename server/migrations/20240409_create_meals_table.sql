-- Création de la table meals
CREATE TABLE IF NOT EXISTS meals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    jour INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('petit-dejeuner', 'dejeuner', 'diner')),
    nom TEXT NOT NULL,
    ingredients TEXT[] NOT NULL,
    etapes TEXT[] NOT NULL,
    temps_preparation INTEGER NOT NULL,
    calories INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création d'un index pour optimiser les requêtes par utilisateur
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);

-- Création d'un index composite pour optimiser les requêtes par jour et type
CREATE INDEX IF NOT EXISTS idx_meals_jour_type ON meals(jour, type);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meals_updated_at
    BEFORE UPDATE ON meals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 