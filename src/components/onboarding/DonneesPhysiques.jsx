import { useState } from 'react';
import { ProfileService } from '../../services/profileService';
import './Onboarding.css';

function DonneesPhysiques({ profileId, onNext, onBack, initialValues = {} }) {
  const [formData, setFormData] = useState({
    sexe: initialValues.sexe || '',
    age: initialValues.age || '',
    taille: initialValues.taille || '', // en cm
    poids: initialValues.poids || '', // en kg
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.sexe || !formData.age || !formData.taille || !formData.poids) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    // Validation des valeurs numériques
    const age = parseInt(formData.age, 10);
    const taille = parseInt(formData.taille, 10);
    const poids = parseInt(formData.poids, 10);

    if (isNaN(age) || age < 1 || age > 120) {
      setError("L'âge doit être un nombre entre 1 et 120");
      return;
    }

    if (isNaN(taille) || taille < 50 || taille > 250) {
      setError('La taille doit être un nombre entre 50 et 250 cm');
      return;
    }

    if (isNaN(poids) || poids < 20 || poids > 300) {
      setError('Le poids doit être un nombre entre 20 et 300 kg');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ProfileService.updateDonneesPhysiques(profileId, formData);
      onNext();
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour des données physiques');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>Vos données physiques</h2>
      <p className="onboarding-description">
        Ces informations nous aideront à calculer vos besoins nutritionnels précis
      </p>

      {error && <div className="onboarding-error">{error}</div>}

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="form-group">
          <label htmlFor="sexe">Sexe</label>
          <select id="sexe" name="sexe" value={formData.sexe} onChange={handleChange} required>
            <option value="" disabled>
              Sélectionnez
            </option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="age">Âge</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            max="120"
            required
            placeholder="Votre âge en années"
          />
        </div>

        <div className="form-group">
          <label htmlFor="taille">Taille (cm)</label>
          <input
            type="number"
            id="taille"
            name="taille"
            value={formData.taille}
            onChange={handleChange}
            min="50"
            max="250"
            required
            placeholder="Votre taille en centimètres"
          />
        </div>

        <div className="form-group">
          <label htmlFor="poids">Poids (kg)</label>
          <input
            type="number"
            id="poids"
            name="poids"
            value={formData.poids}
            onChange={handleChange}
            min="20"
            max="300"
            required
            placeholder="Votre poids en kilogrammes"
          />
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

export default DonneesPhysiques;
