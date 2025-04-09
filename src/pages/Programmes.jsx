import React from 'react';
import ProgrammeCard from '../components/ProgrammeCard';

const Programmes = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
