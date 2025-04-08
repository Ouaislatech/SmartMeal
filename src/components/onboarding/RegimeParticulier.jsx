import { useState } from 'react';
import { ProfileService } from '../../services/profileService';
import './Onboarding.css';

function RegimeParticulier({ profileId, onNext, onBack, initialValues = {} }) {
  const [regimes, setRegimes] = useState({
    sans_gluten: initialValues.regime_particulier?.includes('sans_gluten') || false,
    sans_lactose: initialValues.regime_particulier?.includes('sans_lactose') || false,
    anti_inflammatoire: initialValues.regime_particulier?.includes('anti_inflammatoire') || false,
    proteine: initialValues.regime_particulier?.includes('proteine') || false,
    vegetarien: initialValues.regime_particulier?.includes('vegetarien') || false,
    autre: initialValues.regime_particulier?.includes('autre') || false,
  });

  const [autreRegime, setAutreRegime] = useState(initialValues.autres_regimes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setRegimes((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Au moins un régime doit être sélectionné
    const hasSelectedRegime = Object.values(regimes).some((value) => value === true);

    if (!hasSelectedRegime) {
      setError('Veuillez sélectionner au moins un type de régime');
      return;
    }

    // Si "autre" est sélectionné, il faut préciser
    if (regimes.autre && !autreRegime.trim()) {
      setError('Veuillez préciser votre régime particulier');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convertir les régimes sélectionnés en chaîne de caractères
      const regimeParticulier = Object.keys(regimes)
        .filter((key) => regimes[key])
        .join(',');

      await ProfileService.updateRegimeParticulier(profileId, {
        regime_particulier: regimeParticulier,
        autres_regimes: regimes.autre ? autreRegime : '',
      });

      onNext();
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour du régime particulier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>Votre régime particulier</h2>
      <p className="onboarding-description">
        Sélectionnez les types de régimes qui correspondent à vos besoins
      </p>

      {error && <div className="onboarding-error">{error}</div>}

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="checkbox-options">
          <div className="checkbox-option">
            <input
              type="checkbox"
              id="sans_gluten"
              name="sans_gluten"
              checked={regimes.sans_gluten}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="sans_gluten">Sans gluten</label>
          </div>

          <div className="checkbox-option">
            <input
              type="checkbox"
              id="sans_lactose"
              name="sans_lactose"
              checked={regimes.sans_lactose}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="sans_lactose">Sans lactose</label>
          </div>

          <div className="checkbox-option">
            <input
              type="checkbox"
              id="anti_inflammatoire"
              name="anti_inflammatoire"
              checked={regimes.anti_inflammatoire}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="anti_inflammatoire">Anti-inflammatoire</label>
          </div>

          <div className="checkbox-option">
            <input
              type="checkbox"
              id="proteine"
              name="proteine"
              checked={regimes.proteine}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="proteine">Protéiné</label>
          </div>

          <div className="checkbox-option">
            <input
              type="checkbox"
              id="vegetarien"
              name="vegetarien"
              checked={regimes.vegetarien}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="vegetarien">Végétarien</label>
          </div>

          <div className="checkbox-option">
            <input
              type="checkbox"
              id="autre"
              name="autre"
              checked={regimes.autre}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="autre">Autre</label>
          </div>
        </div>

        {regimes.autre && (
          <div className="form-group">
            <label htmlFor="autre_regime">Précisez votre régime:</label>
            <textarea
              id="autre_regime"
              value={autreRegime}
              onChange={(e) => setAutreRegime(e.target.value)}
              placeholder="Décrivez votre régime particulier"
              rows="3"
            />
          </div>
        )}

        <div className="onboarding-buttons">
          <button type="button" className="onboarding-button-secondary" onClick={onBack}>
            Retour
          </button>
          <button type="submit" className="onboarding-button" disabled={loading}>
            {loading ? 'Chargement...' : 'Continuer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegimeParticulier;
