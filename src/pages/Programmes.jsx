import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProgrammeCard from '../components/ProgrammeCards';
import '../styles/ProgrammeCard.css';

const Programmes = () => {
  const navigate = useNavigate();
  const programmes = [
    {
      title: 'Programme Semaine 1',
      weekNumber: 1,
      description: 'Clique pour découvrir ton programme personnalisé',
    },
    {
      title: 'Programme Semaine 2',
      weekNumber: 2,
      description: 'Clique pour découvrir ton programme personnalisé',
    },
  ];

  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <button className="back-button" onClick={handleBackClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Retour à l'accueil
      </button>
      <h1 className="text-4xl font-bold text-center mb-12">Mes Programmes de Repas</h1>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programmes.map((programme) => (
            <ProgrammeCard
              key={programme.weekNumber}
              title={programme.title}
              weekNumber={programme.weekNumber}
              description={programme.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Programmes;
