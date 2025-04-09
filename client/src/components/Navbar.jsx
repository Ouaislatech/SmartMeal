import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../config/supabase';

const Navbar = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SmartMeal
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/profile-recap">
            Mon Profil
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
