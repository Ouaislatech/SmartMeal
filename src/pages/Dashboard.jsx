import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import ProfilePhoto from '../components/profile/ProfilePhoto';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const currentUser = AuthService.getCurrentUser();
    const currentProfile = AuthService.getCurrentProfile();

    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setProfile(currentProfile);
    setLoading(false);

    // Vérifier si le profil est complet, sinon rediriger vers l'onboarding
    if (currentProfile && !currentProfile.completed) {
      navigate('/onboarding');
    }
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    // La redirection est gérée dans la méthode logout
  };

  const handlePhotoUpdate = (photoUrl) => {
    setProfile((prev) => ({
      ...prev,
      photo_profil: photoUrl,
    }));
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>SmartMeal</h1>
        <div className="dashboard-user-info">
          <div className="user-profile">
            <div className="user-photo-container">
              <ProfilePhoto
                profileId={profile?.id}
                initialPhotoUrl={profile?.photo_profil}
                onPhotoUpdate={handlePhotoUpdate}
              />
            </div>
            <span className="user-name">Bonjour, {user.prenom || 'Utilisateur'}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Bienvenue sur votre tableau de bord !</h2>
          <p>
            Félicitations ! Vous avez complété votre profil et vous êtes prêt à commencer votre
            expérience SmartMeal.
          </p>
        </div>

        <div className="profile-overview">
          <h3>Récapitulatif de votre profil</h3>

          {profile && (
            <div className="profile-details">
              <div className="profile-item">
                <span className="profile-label">Objectif santé:</span>
                <span className="profile-value">{profile.objectif_sante}</span>
              </div>

              {profile.regime_particulier && (
                <div className="profile-item">
                  <span className="profile-label">Régime particulier:</span>
                  <span className="profile-value">
                    {profile.regime_particulier.replace(/,/g, ', ')}
                  </span>
                </div>
              )}

              <div className="profile-item">
                <span className="profile-label">Sexe:</span>
                <span className="profile-value">{profile.sexe}</span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Âge:</span>
                <span className="profile-value">{profile.age} ans</span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Taille:</span>
                <span className="profile-value">{profile.taille} cm</span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Poids:</span>
                <span className="profile-value">{profile.poids} kg</span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Budget alimentaire:</span>
                <span className="profile-value">{profile.budget_alimentaire} €/mois</span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Offre:</span>
                <span className="profile-value">
                  {profile.freemium ? 'Premium (essai gratuit)' : 'Basique'}
                </span>
              </div>
            </div>
          )}

          <div className="profile-actions">
            <button className="edit-profile-button" onClick={() => navigate('/profile-review')}>
              Modifier mon profil
            </button>
          </div>
        </div>

        <div className="coming-soon">
          <h3>Fonctionnalités à venir</h3>
          <ul>
            <li>Création de plans de repas personnalisés</li>
            <li>Génération de listes de courses</li>
            <li>Suivi de votre progression</li>
          </ul>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} SmartMeal - Tous droits réservés</p>
      </footer>
    </div>
  );
}

export default Dashboard;
