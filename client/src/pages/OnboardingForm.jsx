import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Grid,
  Alert,
} from '@mui/material';

const steps = [
  'Informations personnelles',
  'Objectifs et régime',
  'Données physiques',
  'Budget et préférences',
  'Récapitulatif',
];

const OnboardingForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    objectif_sante: '',
    regime_particulier: '',
    autres_regimes: '',
    sexe: '',
    age: '',
    taille: '',
    poids: '',
    budget_alimentaire: '',
    allergies: [],
    preferences: [],
    freemium: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    setError(null);
    if (activeStep === steps.length - 2) {
      // Avant d'aller au récapitulatif, vérifier que toutes les données obligatoires sont remplies
      if (
        !formData.prenom ||
        !formData.nom ||
        !formData.objectif_sante ||
        !formData.sexe ||
        !formData.age ||
        !formData.taille ||
        !formData.poids ||
        !formData.budget_alimentaire
      ) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Objectif de santé</InputLabel>
                <Select
                  name="objectif_sante"
                  value={formData.objectif_sante}
                  onChange={handleChange}
                  label="Objectif de santé"
                >
                  <MenuItem value="perte_poids">Perte de poids</MenuItem>
                  <MenuItem value="prise_masse">Prise de masse</MenuItem>
                  <MenuItem value="stabilisation">Stabilisation</MenuItem>
                  <MenuItem value="performance">Performance sportive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Régime particulier</InputLabel>
                <Select
                  name="regime_particulier"
                  value={formData.regime_particulier}
                  onChange={handleChange}
                  label="Régime particulier"
                >
                  <MenuItem value="vegetarien">Végétarien</MenuItem>
                  <MenuItem value="vegan">Végan</MenuItem>
                  <MenuItem value="sans_gluten">Sans gluten</MenuItem>
                  <MenuItem value="sans_lactose">Sans lactose</MenuItem>
                  <MenuItem value="aucun">Aucun</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Sexe</InputLabel>
                <Select name="sexe" value={formData.sexe} onChange={handleChange} label="Sexe">
                  <MenuItem value="homme">Homme</MenuItem>
                  <MenuItem value="femme">Femme</MenuItem>
                  <MenuItem value="autre">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Âge"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Taille (cm)"
                name="taille"
                value={formData.taille}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Poids (kg)"
                name="poids"
                value={formData.poids}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Budget alimentaire mensuel (€)"
                name="budget_alimentaire"
                value={formData.budget_alimentaire}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!formData.freemium}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        freemium: !e.target.checked,
                      }))
                    }
                    name="freemium"
                  />
                }
                label="Version premium"
              />
            </Grid>
          </Grid>
        );

      case 4:
        return <OnboardingRecap formData={formData} />;

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Création de votre profil
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        {activeStep < steps.length - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Retour
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Suivant
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default OnboardingForm;
