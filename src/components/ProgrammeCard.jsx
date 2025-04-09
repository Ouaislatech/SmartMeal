import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProgrammeCard.css';

const defaultImages = {
  'Programme Semaine 1': '/images/programmes/marche-fruits-legumes.jpg',
  'Programme Semaine 2': '/images/programmes/assiette-saine.jpg',
  'Programme Semaine 3': '/images/programmes/ingredients-frais.jpg',
  'Programme Semaine 4': '/images/programmes/repas-equilibre.jpg',
};

export default function ProgrammeCard({ title, description, image, onClick }) {
  const navigate = useNavigate();
  const imageSrc = image || defaultImages[title] || '/images/programmes/default.jpg';

  return (
    <div className="programme-card">
      <img src={imageSrc} alt={title} />
      <div className="programme-content">
        <div>
          <h2 className="programme-title">{title}</h2>
          <p className="programme-description">{description}</p>
        </div>
        <button onClick={onClick || (() => navigate('/programme'))} className="programme-button">
          Découvrir les repas
        </button>
      </div>
    </div>
  );
}
