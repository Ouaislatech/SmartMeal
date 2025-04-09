import { useNavigate } from 'react-router-dom';
import '../styles/ProgrammeCard.css';

const defaultImages = {
  'Programme Semaine 1': '/images/programmes/marche-fruits-legumes.jpg',
  'Programme Semaine 2': '/images/programmes/assiette-saine.jpg',
  'Programme Semaine 3': '/images/programmes/ingredients-frais.jpg',
  'Programme Semaine 4': '/images/programmes/repas-equilibre.jpg',
};

function BackButton() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <button className="back-button" onClick={handleBackClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Retour à l'accueil
    </button>
  );
}

export default function ProgrammeCard({ title, description, image, onClick, weekNumber }) {
  const navigate = useNavigate();
  const imageSrc = image || defaultImages[title] || '/images/programmes/default.jpg';

  return (
    <div>
      <BackButton />
      <div className="programme-card">
        <img src={imageSrc} alt={title} />
        <div className="programme-content">
          <div>
            <h2 className="programme-title">{title}</h2>
            <p className="programme-description">{description}</p>
          </div>
          <button
            onClick={onClick || (() => navigate(`/meal-program?weekNumber=${weekNumber}`))}
            className="programme-button"
          >
            Découvrir les repas
          </button>
        </div>
      </div>
    </div>
  );
}
