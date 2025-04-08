import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import './AuthForms.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await AuthService.login(formData.email, formData.password);

      // Vérifier si l'utilisateur a déjà terminé l'onboarding
      if (result.data.profile && result.data.profile.completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Se connecter à SmartMeal</h2>
        <p>Entrez vos identifiants pour accéder à votre compte</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Votre mot de passe"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Pas encore de compte ?</p>
          <Link to="/register" className="auth-link">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
