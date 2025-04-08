import { Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import './Home.css';

function Home() {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <div className="home-container">
      <header className="header">
        <h1>SmartMeal</h1>
        <p>Votre assistant de nutrition personnalisé</p>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <Link to="/dashboard" className="auth-button dashboard-button">
              Accéder à mon tableau de bord
            </Link>
          ) : (
            <>
              <Link to="/login" className="auth-button login-button">
                Se connecter
              </Link>
              <Link to="/register" className="auth-button register-button">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h2>Prenez le contrôle de votre alimentation</h2>
            <p className="hero-description">
              SmartMeal vous aide à planifier vos repas en fonction de vos objectifs, préférences et
              contraintes alimentaires.
            </p>

            <div className="hero-features">
              <div className="feature">
                <h3>Plans personnalisés</h3>
                <p>Des repas adaptés à vos besoins nutritionnels spécifiques</p>
              </div>

              <div className="feature">
                <h3>Organisation facile</h3>
                <p>Générez automatiquement votre liste de courses hebdomadaire</p>
              </div>

              <div className="feature">
                <h3>100% local</h3>
                <p>Toutes vos données sont stockées sur votre appareil uniquement</p>
              </div>
            </div>

            {!isAuthenticated && (
              <Link to="/register" className="cta-button">
                Créer un compte gratuit
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} SmartMeal - Application développée localement</p>
      </footer>
    </div>
  );
}

export default Home;
