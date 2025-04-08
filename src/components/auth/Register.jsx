import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import './AuthForms.css';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    prenom: '',
    password: '',
    confirmPassword: '',
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

    // Validation
    if (!formData.email || !formData.password || !formData.prenom) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await AuthService.register(formData.email, formData.password, formData.prenom);
      // Rediriger vers la page d'onboarding
      navigate('/onboarding');
    } catch (error) {
      setError(error.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Créer un compte</h2>
        <p>Inscrivez-vous pour commencer votre parcours de nutrition personnalisée</p>

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
            <label htmlFor="prenom">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
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
              placeholder="6 caractères minimum"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirmez votre mot de passe"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Chargement...' : "S'inscrire"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Déjà inscrit ?</p>
          <Link to="/login" className="auth-link">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
