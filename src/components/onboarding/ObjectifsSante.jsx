import { useState } from 'react';
import { ProfileService } from '../../services/profileService';
import './Onboarding.css';

function ObjectifsSante({ profileId, onNext, initialValue = '' }) {
  const [objectifSante, setObjectifSante] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!objectifSante) {
      setError('Veuillez sélectionner un objectif');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ProfileService.updateObjectifsSante(profileId, objectifSante);
      onNext();
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour des objectifs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>Votre objectif santé</h2>
      <p className="onboarding-description">
        Dites-nous quel est votre objectif principal pour que nous puissions personnaliser votre
        expérience
      </p>

      {error && <div className="onboarding-error">{error}</div>}

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="radio-options">
          <div className={`radio-option ${objectifSante === 'prise-de-masse' ? 'selected' : ''}`}>
            <input
              type="radio"
              id="prise-de-masse"
              name="objectif_sante"
              value="prise-de-masse"
              checked={objectifSante === 'prise-de-masse'}
              onChange={() => setObjectifSante('prise-de-masse')}
            />
            <label htmlFor="prise-de-masse">
              <div className="radio-option-title">Prise de masse</div>
              <div className="radio-option-description">
                Pour développer votre masse musculaire et prendre du poids sainement
              </div>
            </label>
          </div>

          <div className={`radio-option ${objectifSante === 'perte-de-poids' ? 'selected' : ''}`}>
            <input
              type="radio"
              id="perte-de-poids"
              name="objectif_sante"
              value="perte-de-poids"
              checked={objectifSante === 'perte-de-poids'}
              onChange={() => setObjectifSante('perte-de-poids')}
            />
            <label htmlFor="perte-de-poids">
              <div className="radio-option-title">Perte de poids</div>
              <div className="radio-option-description">
                Pour perdre du poids de manière équilibrée et durable
              </div>
            </label>
          </div>

          <div className={`radio-option ${objectifSante === 'stabilisation' ? 'selected' : ''}`}>
            <input
              type="radio"
              id="stabilisation"
              name="objectif_sante"
              value="stabilisation"
              checked={objectifSante === 'stabilisation'}
              onChange={() => setObjectifSante('stabilisation')}
            />
            <label htmlFor="stabilisation">
              <div className="radio-option-title">Stabilisation du poids</div>
              <div className="radio-option-description">
                Pour maintenir votre poids actuel et améliorer votre santé globale
              </div>
            </label>
          </div>

          <div
            className={`radio-option ${objectifSante === 'regime-particulier' ? 'selected' : ''}`}
          >
            <input
              type="radio"
              id="regime-particulier"
              name="objectif_sante"
              value="regime-particulier"
              checked={objectifSante === 'regime-particulier'}
              onChange={() => setObjectifSante('regime-particulier')}
            />
            <label htmlFor="regime-particulier">
              <div className="radio-option-title">Régime particulier</div>
              <div className="radio-option-description">
                Pour suivre un régime alimentaire spécifique selon vos besoins
              </div>
            </label>
          </div>
        </div>

        <div className="onboarding-buttons">
          <button type="submit" className="onboarding-button" disabled={loading}>
            {loading ? 'Chargement...' : 'Continuer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ObjectifsSante;
