import { useState } from "react";
import { ApiService } from "../services/api";
import "./OnboardingForm.css";

function OnboardingForm({ onUserCreated }) {
  const [formData, setFormData] = useState({
    prenom: "",
    objectif: "perte-de-poids",
    allergies: "",
    preferences: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await ApiService.createUser(formData);

      setSuccess(true);
      setLoading(false);

      // Notification du parent que l'utilisateur a été créé
      if (onUserCreated) {
        onUserCreated(response.data);
      }

      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setFormData({
          prenom: "",
          objectif: "perte-de-poids",
          allergies: "",
          preferences: "",
        });
        setSuccess(false);
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError(
        error.message || "Une erreur est survenue lors de la création du profil"
      );
    }
  };

  return (
    <div className="onboarding-form-container">
      <h2>Bienvenue sur SmartMeal</h2>
      <p>Créez votre profil pour obtenir des recommandations personnalisées</p>

      {success && (
        <div className="success-message">
          Votre profil a été créé avec succès !
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="form-group">
          <label htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
            placeholder="Votre prénom"
          />
        </div>

        <div className="form-group">
          <label htmlFor="objectif">Objectif</label>
          <select
            id="objectif"
            name="objectif"
            value={formData.objectif}
            onChange={handleChange}
            required
          >
            <option value="perte-de-poids">Perte de poids</option>
            <option value="prise-de-masse">Prise de masse</option>
            <option value="transition-alimentaire">
              Transition alimentaire
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="allergies">Allergies connues</label>
          <textarea
            id="allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Listez vos allergies alimentaires (optionnel)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="preferences">Préférences alimentaires</label>
          <textarea
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            placeholder="Vos préférences alimentaires (optionnel)"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Enregistrement..." : "Créer mon profil"}
        </button>
      </form>
    </div>
  );
}

export default OnboardingForm;
