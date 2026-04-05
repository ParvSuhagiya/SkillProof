import React from 'react';

const StatCard = ({ label, value, sub }) => {
  return (
    <div className="bg-[#111] border border-white/10 rounded-lg p-5">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
};

export default StatCard;
