import React from 'react';

const difficultyStyles = {
  Easy:   'text-green-400 bg-green-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  Hard:   'text-red-400 bg-red-400/10',
};

const ChallengeCard = ({ title, difficulty, description }) => {
  return (
    <div className="bg-[#111] border border-white/10 rounded-lg p-5 flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${difficultyStyles[difficulty] || 'text-gray-400 bg-white/5'}`}>
            {difficulty}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
      <button className="mt-1 self-start text-xs font-semibold text-blue-400 border border-blue-500/40 px-3 py-1.5 rounded hover:bg-blue-500/10 transition-colors">
        Start Challenge →
      </button>
    </div>
  );
};

export default ChallengeCard;
