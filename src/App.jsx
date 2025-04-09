import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OnboardingContainer from './components/onboarding/OnboardingContainer';
import Dashboard from './pages/Dashboard';
import Programmes from './pages/Programmes';
import ProgrammeCards from './pages/ProgrammeCards';
import Home from './pages/Home';
import ProfileReview from './pages/ProfileReview';
import { AuthService } from './services/authService';
import './App.css';

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
    <div className="app-container">
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
          path="/programmes"
          element={
            <ProtectedRoute>
              <Programmes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programme-cards"
          element={
            <ProtectedRoute>
              <ProgrammeCards />
            </ProtectedRoute>
          }
        />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingContainer />
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
    </div>
  );
}

export default App;
