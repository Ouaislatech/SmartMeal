import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import mealPrograms from '../data/mealPrograms.json';
import './MealProgramPage.css';

const MealProgramPage = () => {
  const query = new URLSearchParams(window.location.search);
  const weekNumber = query.get('weekNumber') || 1;
  const [expandedMeals, setExpandedMeals] = useState({});

  const weekData = mealPrograms[`week${weekNumber}`];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const meals = ['breakfast', 'lunch', 'dinner'];
  const mealNames = {
    breakfast: 'Petit-déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
  };

  const mealImages = {
    breakfast: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    lunch: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    dinner: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
  };

  const toggleMealSteps = (day, meal) => {
    const mealId = `${day}-${meal}`;
    setExpandedMeals((prev) => ({
      ...prev,
      [mealId]: !prev[mealId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link to="/programmes" className="back-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Retour aux programmes
      </Link>

      <h1 className="text-4xl font-bold text-center mb-12">Programme Semaine {weekNumber || 1}</h1>

      <div className="meal-program-container">
        {days.map((day) => (
          <div key={day} className="day-card">
            <h2 className="day-title capitalize">{day}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {meals.map((meal) => {
                const mealData = weekData?.days[day]?.[meal];
                if (!mealData) return null;

                const mealId = `${day}-${meal}`;
                const isExpanded = expandedMeals[mealId];

                return (
                  <div key={meal} className="meal-card">
                    <img src={mealImages[meal]} alt={mealData.name} className="meal-image" />
                    <div className="meal-content">
                      <h3 className="meal-title">{mealNames[meal]}</h3>
                      <h4 className="text-lg font-semibold mb-2">{mealData.name}</h4>
                      <p className="meal-time">Temps de préparation : {mealData.preparationTime}</p>

                      <div className="mb-3">
                        <h5 className="font-medium mb-1">Ingrédients :</h5>
                        <ul className="meal-ingredients">
                          {mealData.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        className="toggle-steps-btn"
                        onClick={() => toggleMealSteps(day, meal)}
                      >
                        {isExpanded ? 'Masquer les étapes' : 'Voir les étapes'}
                      </button>

                      <div className={`meal-steps ${isExpanded ? 'active' : ''}`}>
                        <h5 className="font-medium mb-1">Étapes de préparation :</h5>
                        <ol className="list-decimal list-inside">
                          {mealData.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
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
