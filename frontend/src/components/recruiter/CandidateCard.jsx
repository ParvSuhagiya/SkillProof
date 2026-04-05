import React from 'react';

const skillColors = {
  Frontend:   'text-blue-400 bg-blue-400/10',
  Backend:    'text-purple-400 bg-purple-400/10',
  Fullstack:  'text-green-400 bg-green-400/10',
  DevOps:     'text-yellow-400 bg-yellow-400/10',
  Mobile:     'text-pink-400 bg-pink-400/10',
  ML:         'text-orange-400 bg-orange-400/10',
};

const CandidateCard = ({ candidate, isSelected, onSelect, onShortlist, shortlisted }) => {
  const scoreColor =
    candidate.score >= 800 ? 'text-green-400' :
    candidate.score >= 600 ? 'text-yellow-400' :
    'text-red-400';

  return (
    <tr className={`border-b border-white/5 transition-colors ${isSelected ? 'bg-blue-500/5' : 'hover:bg-white/[0.02]'}`}>
      {/* Select checkbox */}
      <td className="py-3 pl-4 pr-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(candidate.id)}
          className="accent-blue-500 w-3.5 h-3.5 cursor-pointer"
        />
      </td>

      {/* Name + Location */}
      <td className="py-3 pr-4">
        <p className="text-sm font-medium text-white">{candidate.name}</p>
        <p className="text-xs text-gray-600">{candidate.location}</p>
      </td>

      {/* Skills */}
      <td className="py-3 pr-4">
        <div className="flex flex-wrap gap-1">
          {candidate.skills.map((skill) => (
            <span
              key={skill}
              className={`text-xs px-1.5 py-0.5 rounded font-medium ${skillColors[skill] || 'text-gray-400 bg-white/5'}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </td>

      {/* Score */}
      <td className="py-3 pr-4">
        <span className={`text-sm font-bold ${scoreColor}`}>{candidate.score}</span>
        <span className="text-xs text-gray-600"> /1000</span>
      </td>

      {/* Success Rate */}
      <td className="py-3 pr-4 hidden md:table-cell">
        <span className="text-sm text-gray-300">{candidate.successRate}%</span>
      </td>

      {/* Rank */}
      <td className="py-3 pr-4 hidden lg:table-cell">
        <span className="text-xs text-gray-500">#{candidate.rank}</span>
      </td>

      {/* Actions */}
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <button className="text-xs text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded hover:bg-blue-500/10 transition whitespace-nowrap">
            View Profile
          </button>
          <button
            onClick={() => onShortlist(candidate.id)}
            className={`text-xs px-2.5 py-1 rounded border transition whitespace-nowrap ${
              shortlisted
                ? 'text-green-400 border-green-500/30 bg-green-400/5'
                : 'text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            {shortlisted ? '✓ Shortlisted' : 'Shortlist'}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CandidateCard;
