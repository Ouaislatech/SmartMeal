import { useState } from 'react';
import { ProfileService } from '../../services/profileService';
import './Onboarding.css';

function BudgetAlimentaire({ profileId, onNext, onBack, initialValue = '' }) {
  const [budget, setBudget] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setBudget(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!budget) {
      setError('Veuillez indiquer votre budget alimentaire mensuel');
      return;
    }

    const budgetValue = parseInt(budget, 10);

    if (isNaN(budgetValue) || budgetValue < 50 || budgetValue > 2000) {
      setError('Le budget doit être un nombre entre 50 et 2000 €');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ProfileService.updateBudget(profileId, budgetValue);
      onNext();
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour du budget alimentaire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>Votre budget alimentaire</h2>
      <p className="onboarding-description">
        Indiquez combien vous dépensez habituellement en courses alimentaires par mois
      </p>

      {error && <div className="onboarding-error">{error}</div>}

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="form-group">
          <label htmlFor="budget">Budget mensuel (€)</label>
          <div className="input-with-icon">
            <input
              type="number"
              id="budget"
              name="budget"
              value={budget}
              onChange={handleChange}
              min="50"
              max="2000"
              required
              placeholder="Votre budget mensuel en euros"
            />
            <span className="input-icon">€</span>
          </div>
          <small className="form-hint">
            Montant approximatif que vous dépensez mensuellement pour vos courses alimentaires
          </small>
        </div>

        <div className="budget-range">
          <div className="budget-indicator">
            <div className="budget-label">Économique</div>
            <div className="budget-value">50€</div>
          </div>
          <div className="budget-indicator">
            <div className="budget-label">Modéré</div>
            <div className="budget-value">200€</div>
          </div>
          <div className="budget-indicator">
            <div className="budget-label">Confort</div>
            <div className="budget-value">500€</div>
          </div>
          <div className="budget-indicator">
            <div className="budget-label">Premium</div>
            <div className="budget-value">1000€+</div>
          </div>
        </div>

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

export default BudgetAlimentaire;
