import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import ObjectifsSante from './ObjectifsSante';
import RegimeParticulier from './RegimeParticulier';
import DonneesPhysiques from './DonneesPhysiques';
import BudgetAlimentaire from './BudgetAlimentaire';
import Freemium from './Freemium';
import './Onboarding.css';

function OnboardingContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const totalSteps = 5;
  const navigate = useNavigate();

  // Récupérer l'utilisateur et le profil au chargement
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    const currentProfile = AuthService.getCurrentProfile();

    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setProfile(currentProfile);
    setLoading(false);

    // Déterminer l'étape initiale en fonction du profil existant
    if (currentProfile) {
      if (currentProfile.objectif_sante) setCurrentStep(2);
      if (currentProfile.regime_particulier !== null) setCurrentStep(3);
      if (currentProfile.sexe) setCurrentStep(4);
      if (currentProfile.budget_alimentaire) setCurrentStep(5);
      if (currentProfile.completed) navigate('/dashboard');
    }
  }, [navigate]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Onboarding terminé
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="onboarding-loading">
        <p>Chargement...</p>
      </div>
    );
  }

  // Rendre l'étape actuelle
  const renderStep = () => {
    if (!profile || !user) return null;

    switch (currentStep) {
      case 1:
        return (
          <ObjectifsSante
            profileId={profile.id}
            onNext={handleNext}
            initialValue={profile.objectif_sante || ''}
          />
        );
      case 2:
        // Afficher l'étape régime particulier pour tous les utilisateurs
        return (
          <RegimeParticulier
            profileId={profile.id}
            onNext={handleNext}
            onBack={handleBack}
            initialValues={{
              regime_particulier: profile.regime_particulier || '',
              autres_regimes: profile.autres_regimes || '',
            }}
          />
        );
      case 3:
        return (
          <DonneesPhysiques
            profileId={profile.id}
            onNext={handleNext}
            onBack={handleBack}
            initialValues={{
              sexe: profile.sexe || '',
              age: profile.age || '',
              taille: profile.taille || '',
              poids: profile.poids || '',
            }}
          />
        );
      case 4:
        return (
          <BudgetAlimentaire
            profileId={profile.id}
            onNext={handleNext}
            onBack={handleBack}
            initialValue={profile.budget_alimentaire || ''}
          />
        );
      case 5:
        return (
          <Freemium
            profileId={profile.id}
            onNext={handleNext}
            onBack={handleBack}
            initialValue={profile.freemium === 1}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-progress">
        <div className="onboarding-progress-bar">
          <div
            className="onboarding-progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="onboarding-step-indicator">
          Étape {currentStep} sur {totalSteps}
        </div>
      </div>

      <div className="onboarding-content">{renderStep()}</div>
    </div>
  );
}

export default OnboardingContainer;
