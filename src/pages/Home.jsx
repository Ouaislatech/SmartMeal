import { Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { LogoutButton } from '../components/LogoutButton';
import './Home.css';

function Home() {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <div className="home-container">
      {isAuthenticated && (
        <div className="header">
          <Link to="/profile-review">
            <button className="profile-button">Profil</button>
          </Link>
          <LogoutButton />
        </div>
      )}

      <div className="content-wrapper">
        <div className="left-column">
          <img
            src="https://images.pexels.com/photos/18968671/pexels-photo-18968671/free-photo-of-plat-de-poulet-chinois.jpeg"
            alt="Repas sain et équilibré"
            className="hero-image"
          />
        </div>

        <div className="right-column">
          <div className="text-content">
            <h1>Smart Meal</h1>
            <p className="slogan">Prenez le contrôle de votre alimentation</p>
          </div>

          <div className="cta-section">
            {isAuthenticated ? (
              <Link to="/programmes">
                <button className="button-programs">Voir mes programmes</button>
              </Link>
            ) : (
              <div className="auth-buttons">
                <Link to="/register">
                  <button className="primary-button">S'inscrire</button>
                </Link>
                <Link to="/login">
                  <button className="secondary-button">Connexion</button>
                </Link>
              </div>
            )}
          </div>

          <div className="info-cards">
            <div className="info-card">
              <h3>Plans personnalisés</h3>
              <p>Des repas adaptés à vos besoins nutritionnels spécifiques</p>
            </div>
            <div className="info-card">
              <h3>Organisation facile</h3>
              <p>Générez automatiquement votre liste de courses hebdomadaire et votre budget</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} SmartMeal - Application développée localement</p>
      </footer>
    </div>
  );
}

export default Home;
