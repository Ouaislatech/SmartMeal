import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileService } from '../../services/profileService';
import './Onboarding.css';

function Freemium({ profileId, onNext, onBack, initialValue = true }) {
  const [freemium, setFreemium] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRadioChange = (value) => {
    setFreemium(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await ProfileService.updateFreemium(profileId, freemium);
      navigate('/profile-review');
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour des options freemium');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>Offre d'essai</h2>
      <p className="onboarding-description">
        Souhaitez-vous essayer notre offre gratuite pendant 2 semaines ?
      </p>

      {error && <div className="onboarding-error">{error}</div>}

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="options-container">
          <div
            className={`option-card ${freemium ? 'selected' : ''}`}
            onClick={() => handleRadioChange(true)}
          >
            <input
              type="radio"
              id="freemium_yes"
              name="freemium"
              checked={freemium}
              onChange={() => handleRadioChange(true)}
            />
            <div className="option-content">
              <h3>Oui, j'essaie gratuitement</h3>
              <ul>
                <li>Accès illimité pendant 2 semaines</li>
                <li>Plans de repas personnalisés</li>
                <li>Liste de courses automatique</li>
                <li>Aucun engagement</li>
              </ul>
              <p className="option-note">Vous pourrez annuler à tout moment</p>
            </div>
          </div>

          <div
            className={`option-card ${!freemium ? 'selected' : ''}`}
            onClick={() => handleRadioChange(false)}
          >
            <input
              type="radio"
              id="freemium_no"
              name="freemium"
              checked={!freemium}
              onChange={() => handleRadioChange(false)}
            />
            <div className="option-content">
              <h3>Non, merci</h3>
              <p>Je préfère utiliser la version basique pour le moment</p>
              <ul>
                <li>Fonctionnalités limitées</li>
                <li>Suggestions de repas génériques</li>
                <li>Pas de liste de courses</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="onboarding-buttons">
          <button type="button" className="onboarding-button-secondary" onClick={onBack}>
            Retour
          </button>
          <button type="submit" className="onboarding-button" disabled={loading}>
            {loading ? 'Chargement...' : 'Vérifier mon profil'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Freemium;
