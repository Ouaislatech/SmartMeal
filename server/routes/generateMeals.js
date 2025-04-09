const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/generate', async (req, res) => {
  try {
    const { userId } = req.body;

    // Récupération des informations du profil utilisateur
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Vérification si des repas existent déjà pour cet utilisateur
    const { data: existingMeals, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId);

    if (mealsError) throw mealsError;

    if (existingMeals && existingMeals.length > 0) {
      return res.json(existingMeals);
    }

    // Préparation du prompt pour OpenAI
    const prompt = `Génère un programme de repas sur 7 jours pour une personne avec les caractéristiques suivantes:
      - Régime: ${userProfile.diet}
      - Objectif: ${userProfile.health_goal}
      - Taille: ${userProfile.height}cm
      - Poids: ${userProfile.weight}kg
      - Sexe: ${userProfile.gender}
      - Âge: ${userProfile.age}
      - Budget: ${userProfile.budget}€/mois
      - Allergies: ${userProfile.allergies.join(', ')}

      Retourne la réponse au format JSON avec la structure suivante pour chaque repas:
      {
        "jour": number,
        "type": "petit-dejeuner" | "dejeuner" | "diner",
        "nom": string,
        "ingredients": string[],
        "etapes": string[],
        "temps_preparation": number,
        "calories": number
      }`;

    // Appel à l'API OpenAI
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
      response_format: { type: 'json_object' },
    });

    const meals = JSON.parse(completion.choices[0].message.content);

    // Stockage des repas dans Supabase
    const mealsToInsert = meals.map((meal) => ({
      user_id: userId,
      ...meal,
    }));

    const { error: insertError } = await supabase.from('meals').insert(mealsToInsert);

    if (insertError) throw insertError;

    res.json(meals);
  } catch (error) {
    console.error('Erreur lors de la génération des repas:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des repas' });
  }
});

module.exports = router;
