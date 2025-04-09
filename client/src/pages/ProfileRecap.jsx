import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const ProfileRecap = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Utilisateur non connecté');
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    navigate('/edit-profile');
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
      <Container>
        <Typography color="error" variant="h6">
          Erreur: {error}
        </Typography>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <Typography variant="h6">Aucun profil trouvé. Veuillez compléter votre profil.</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/onboarding')}
          sx={{ mt: 2 }}
        >
          Créer mon profil
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
        <IconButton onClick={handleEdit} sx={{ position: 'absolute', right: 16, top: 16 }}>
          <EditIcon />
        </IconButton>

        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar src={profile.photo_profil} sx={{ width: 120, height: 120, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            {profile.prenom}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Objectifs de santé */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Objectifs de santé
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip label={profile.objectif_sante} color="primary" variant="outlined" />
            </Box>
          </Grid>

          {/* Régime alimentaire */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Régime alimentaire
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {profile.regime_particulier && (
                <Chip label={profile.regime_particulier} color="secondary" variant="outlined" />
              )}
              {profile.autres_regimes && (
                <Chip label={profile.autres_regimes} color="secondary" variant="outlined" />
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
                <strong>Sexe:</strong> {profile.sexe}
              </Typography>
              <Typography>
                <strong>Âge:</strong> {profile.age} ans
              </Typography>
              <Typography>
                <strong>Taille:</strong> {profile.taille} cm
              </Typography>
              <Typography>
                <strong>Poids:</strong> {profile.poids} kg
              </Typography>
            </Box>
          </Grid>

          {/* Budget alimentaire */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Budget alimentaire
            </Typography>
            <Typography variant="h5" color="primary">
              {profile.budget_alimentaire} €/mois
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
              {profile.allergies?.map((allergie, index) => (
                <Chip key={index} label={allergie} color="error" variant="outlined" />
              ))}
              {profile.preferences?.map((preference, index) => (
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
                label={profile.freemium ? 'Version gratuite' : 'Version premium'}
                color={profile.freemium ? 'default' : 'primary'}
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfileRecap;
