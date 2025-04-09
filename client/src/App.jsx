import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ProfileRecap from './pages/ProfileRecap';
import EditProfile from './pages/EditProfile';
import OnboardingForm from './pages/OnboardingForm';
import Navbar from './components/Navbar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/profile-recap" element={<ProfileRecap />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          {/* Ajoutez ici vos autres routes */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
