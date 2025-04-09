import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
} from '@mui/material';

const RecipeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { meal } = location.state || {};

  if (!meal) {
    return (
      <Box p={3}>
        <Typography color="error">Recette non trouvée</Typography>
        <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Retour
      </Button>

      <Typography variant="h4" gutterBottom>
        {meal.nom}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Temps de préparation"
                    secondary={`${meal.temps_preparation} minutes`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Calories" secondary={`${meal.calories} kcal`} />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ingrédients
              </Typography>
              <List>
                {meal.ingredients.map((ingredient, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Étapes de préparation
            </Typography>
            <Stepper orientation="vertical">
              {meal.etapes.map((etape, index) => (
                <Step key={index} active={true}>
                  <StepLabel>
                    <Typography>{etape}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDetails;
