import React from 'react';

const AdminStatCard = ({ label, value, sub, accent }) => {
  const accentMap = {
    blue:   'border-blue-500/20 text-blue-400',
    red:    'border-red-500/20  text-red-400',
    green:  'border-green-500/20 text-green-400',
    yellow: 'border-yellow-500/20 text-yellow-400',
  };
  const accentClass = accentMap[accent] || '';

  return (
    <div className={`bg-[#111] border border-white/10 rounded-lg p-5 ${accent ? 'border-l-2 ' + accentClass.split(' ')[0] : ''}`}>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ? accentClass.split(' ')[1] : 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
};

export default AdminStatCard;
