import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OnboardingRecap = ({ formData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const profileData = {
        user_id: user.id,
        prenom: formData.prenom,
        nom: formData.nom,
        objectif_sante: formData.objectif_sante,
        regime_particulier: formData.regime_particulier,
        autres_regimes: formData.autres_regimes,
        sexe: formData.sexe,
        age: formData.age,
        taille: formData.taille,
        poids: formData.poids,
        budget_alimentaire: formData.budget_alimentaire,
        allergies: formData.allergies || [],
        preferences: formData.preferences || [],
        freemium: formData.freemium,
        completed: true,
      };

      const { error } = await supabase.from('profiles').insert([profileData]);

      if (error) throw error;

      // Redirection vers la page de profil
      navigate('/profile-recap');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mr: 2 }}>
            Retour
          </Button>
          <Typography variant="h4" component="h1">
            Récapitulatif de votre profil
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Informations personnelles */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Informations personnelles
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>
                <strong>Prénom:</strong> {formData.prenom}
              </Typography>
              <Typography>
                <strong>Nom:</strong> {formData.nom}
              </Typography>
              <Typography>
                <strong>Email:</strong> {formData.email}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Objectifs et régime */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Objectif de santé
            </Typography>
            <Chip label={formData.objectif_sante} color="primary" variant="outlined" />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Régime alimentaire
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.regime_particulier && (
                <Chip label={formData.regime_particulier} color="secondary" variant="outlined" />
              )}
              {formData.autres_regimes && (
                <Chip label={formData.autres_regimes} color="secondary" variant="outlined" />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Données physiques */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Données physiques
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>
                <strong>Sexe:</strong> {formData.sexe}
              </Typography>
              <Typography>
                <strong>Âge:</strong> {formData.age} ans
              </Typography>
              <Typography>
                <strong>Taille:</strong> {formData.taille} cm
              </Typography>
              <Typography>
                <strong>Poids:</strong> {formData.poids} kg
              </Typography>
            </Box>
          </Grid>

          {/* Budget alimentaire */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Budget alimentaire
            </Typography>
            <Typography variant="h5" color="primary">
              {formData.budget_alimentaire} €/mois
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Allergies et préférences */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Allergies et préférences
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.allergies?.map((allergie, index) => (
                <Chip key={index} label={allergie} color="error" variant="outlined" />
              ))}
              {formData.preferences?.map((preference, index) => (
                <Chip key={index} label={preference} color="success" variant="outlined" />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Statut freemium */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6" color="primary">
                Statut du compte:
              </Typography>
              <Chip
                label={formData.freemium ? 'Version gratuite' : 'Version premium'}
                color={formData.freemium ? 'default' : 'primary'}
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Boutons */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button variant="outlined" onClick={handleBack} disabled={loading}>
                Retour
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Finaliser mon profil
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OnboardingRecap;
