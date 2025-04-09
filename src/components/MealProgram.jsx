import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

const MealProgram = ({ weekNumber = 1 }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5001/api/meals/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            weekNumber: weekNumber,
          }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des repas');
        }

        const data = await response.json();
        setMeals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [navigate, weekNumber]);

  const handleStartRecipe = (meal) => {
    navigate('/recipe', { state: { meal } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Programme Semaine {weekNumber}
      </Typography>
      <Grid container spacing={3}>
        {Array.from({ length: 7 }, (_, dayIndex) => (
          <Grid item xs={12} key={dayIndex}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Jour {dayIndex + 1}
                </Typography>
                <Grid container spacing={2}>
                  {['petit-dejeuner', 'dejeuner', 'diner'].map((mealType) => {
                    const meal = meals.find((m) => m.jour === dayIndex + 1 && m.type === mealType);
                    return (
                      <Grid item xs={12} md={4} key={mealType}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                            </Typography>
                            {meal ? (
                              <>
                                <Typography variant="h6">{meal.nom}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Temps de préparation: {meal.temps_preparation} min
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Calories: {meal.calories} kcal
                                </Typography>
                                <Box mt={2}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleStartRecipe(meal)}
                                  >
                                    Lancer la recette
                                  </Button>
                                </Box>
                              </>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                Chargement...
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MealProgram;
