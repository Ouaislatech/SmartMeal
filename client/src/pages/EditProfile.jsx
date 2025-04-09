import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase.from('profiles').update(profile).eq('user_id', user.id);

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/profile-recap'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Profil non trouvé
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Modifier mon profil
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profil mis à jour avec succès !
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Prénom */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prénom"
                name="prenom"
                value={profile.prenom || ''}
                onChange={handleChange}
              />
            </Grid>

            {/* Objectif de santé */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Objectif de santé</InputLabel>
                <Select
                  name="objectif_sante"
                  value={profile.objectif_sante || ''}
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

            {/* Régime particulier */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Régime particulier</InputLabel>
                <Select
                  name="regime_particulier"
                  value={profile.regime_particulier || ''}
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

            {/* Données physiques */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sexe</InputLabel>
                <Select name="sexe" value={profile.sexe || ''} onChange={handleChange} label="Sexe">
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
                value={profile.age || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Taille (cm)"
                name="taille"
                value={profile.taille || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Poids (kg)"
                name="poids"
                value={profile.poids || ''}
                onChange={handleChange}
              />
            </Grid>

            {/* Budget alimentaire */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Budget alimentaire mensuel (€)"
                name="budget_alimentaire"
                value={profile.budget_alimentaire || ''}
                onChange={handleChange}
              />
            </Grid>

            {/* Statut freemium */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!profile.freemium}
                    onChange={(e) =>
                      setProfile((prev) => ({
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

            {/* Boutons */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/profile-recap')}
                  disabled={saving}
                >
                  Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : 'Enregistrer'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfile;
