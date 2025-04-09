import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProgrammeCard.css';

export default function ProgrammeCard({ title, description, image, onClick }) {
  const navigate = useNavigate();

  return (
    <div className="programme-card flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden hover:scale-[1.01] transition-transform duration-300 w-full max-w-5xl mx-auto">
      {/* Image Section */}
      <div className="programme-card-image md:w-1/2 w-full h-64 md:h-auto">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="programme-card-badge">2 semaines incluses</div>
      </div>

      {/* Content Section */}
      <div className="programme-card-content flex flex-col justify-between p-8 md:w-1/2">
        <div>
          <h2 className="programme-card-title text-3xl font-semibold text-gray-900 mb-3">
            {title}
          </h2>
          <p className="programme-card-subtitle text-gray-600 mb-6 text-lg">{description}</p>
        </div>

        <button
          onClick={onClick || (() => navigate('/programme'))}
          className="programme-card-button bg-green-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-green-700 transition duration-200 w-fit"
        >
          Découvrir les repas
        </button>
      </div>
    </div>
  );
}
