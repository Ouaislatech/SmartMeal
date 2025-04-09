import React from 'react';
import MealProgram from '../components/MealProgram';
import { useParams } from 'react-router-dom';

const MealProgramPage = () => {
  const { weekNumber } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-12">Programme Semaine {weekNumber || 1}</h1>
      <MealProgram weekNumber={weekNumber || 1} />
    </div>
  );
};

export default MealProgramPage;
