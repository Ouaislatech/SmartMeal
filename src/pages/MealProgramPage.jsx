import React from 'react';
import { useParams } from 'react-router-dom';
import mealPrograms from '../data/mealPrograms.json';

const MealProgramPage = () => {
  const query = new URLSearchParams(window.location.search);
  const weekNumber = query.get('weekNumber') || 1;

  const weekData = mealPrograms[`week${weekNumber}`];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const meals = ['breakfast', 'lunch', 'dinner'];
  const mealNames = {
    breakfast: 'Petit-déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-12">Programme Semaine {weekNumber || 1}</h1>

      <div className="max-w-7xl mx-auto">
        {days.map((day) => (
          <div key={day} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 capitalize">{day}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {meals.map((meal) => {
                const mealData = weekData?.days[day]?.[meal];
                if (!mealData) return null;

                return (
                  <div key={meal} className="border rounded-lg p-4">
                    <h3 className="text-xl font-medium mb-2">{mealNames[meal]}</h3>
                    <h4 className="text-lg font-semibold mb-2">{mealData.name}</h4>

                    <div className="mb-3">
                      <h5 className="font-medium mb-1">Ingrédients :</h5>
                      <ul className="list-disc list-inside">
                        {mealData.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-3">
                      <h5 className="font-medium">Temps de préparation :</h5>
                      <p>{mealData.preparationTime}</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">Étapes de préparation :</h5>
                      <ol className="list-decimal list-inside">
                        {mealData.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealProgramPage;
