import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ProfileRecap from './pages/ProfileRecap';
import EditProfile from './pages/EditProfile';
import OnboardingForm from './pages/OnboardingForm';
import MealProgramPage from './pages/MealProgramPage';
import RecipePage from './pages/RecipePage';
import Programmes from './pages/Programmes';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ProfileReview from './pages/ProfileReview';
import { AuthService } from './services/authService';

// Composant pour les routes protégées
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile-recap"
            element={
              <ProtectedRoute>
                <ProfileRecap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meal-program"
            element={
              <ProtectedRoute>
                <MealProgramPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recipe"
            element={
              <ProtectedRoute>
                <RecipePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/programmes"
            element={
              <ProtectedRoute>
                <Programmes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/semaine-1"
            element={
              <ProtectedRoute>
                <MealProgramPage weekNumber={1} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/semaine-2"
            element={
              <ProtectedRoute>
                <MealProgramPage weekNumber={2} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile-review"
            element={
              <ProtectedRoute>
                <ProfileReview />
              </ProtectedRoute>
            }
          />

          {/* Route par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
