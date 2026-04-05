import React, { useState } from 'react';

const initialChallenges = [
  { id: 1, title: 'Two Sum',               difficulty: 'Easy',   attempts: 1240, successRate: 78 },
  { id: 2, title: 'Binary Search Tree',    difficulty: 'Medium', attempts: 890,  successRate: 54 },
  { id: 3, title: 'Merge Intervals',       difficulty: 'Medium', attempts: 670,  successRate: 61 },
  { id: 4, title: 'LRU Cache',             difficulty: 'Hard',   attempts: 430,  successRate: 38 },
  { id: 5, title: 'Graph BFS / DFS',       difficulty: 'Medium', attempts: 510,  successRate: 57 },
  { id: 6, title: 'Sliding Window Max',    difficulty: 'Hard',   attempts: 290,  successRate: 29 },
  { id: 7, title: 'Valid Parentheses',     difficulty: 'Easy',   attempts: 1580, successRate: 84 },
];

const diffStyle = {
  Easy:   'text-green-400 bg-green-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  Hard:   'text-red-400 bg-red-400/10',
};

const ChallengeTable = () => {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [showAdd, setShowAdd]       = useState(false);
  const [newTitle, setNewTitle]     = useState('');
  const [newDiff,  setNewDiff]      = useState('Easy');

  const deleteChallenge = (id) => setChallenges((prev) => prev.filter((c) => c.id !== id));

  const addChallenge = () => {
    if (!newTitle.trim()) return;
    setChallenges((prev) => [
      ...prev,
      { id: Date.now(), title: newTitle.trim(), difficulty: newDiff, attempts: 0, successRate: 0 },
    ]);
    setNewTitle('');
    setNewDiff('Easy');
    setShowAdd(false);
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div>
          <h2 className="text-sm font-semibold text-white">Challenge Management</h2>
          <p className="text-xs text-gray-600 mt-0.5">{challenges.length} challenges</p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="text-xs font-medium text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded hover:bg-blue-500/10 transition"
        >
          {showAdd ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 bg-[#0d0d0d]">
          <input
            type="text"
            placeholder="Challenge title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-[#111] border border-white/10 text-gray-300 text-sm rounded-md px-3 py-2 outline-none placeholder-gray-600 focus:border-white/20"
          />
          <select
            value={newDiff}
            onChange={(e) => setNewDiff(e.target.value)}
            className="bg-[#111] border border-white/10 text-gray-400 text-xs rounded-md px-3 py-2 outline-none"
          >
            {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
          </select>
          <button
            onClick={addChallenge}
            className="text-xs font-semibold bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Save
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[520px]">
          <thead>
            <tr className="text-gray-600 border-b border-white/5">
              <th className="py-2.5 pl-5 pr-4 text-left font-medium">Title</th>
              <th className="py-2.5 pr-4 text-left font-medium">Difficulty</th>
              <th className="py-2.5 pr-4 text-left font-medium hidden sm:table-cell">Attempts</th>
              <th className="py-2.5 pr-4 text-left font-medium hidden md:table-cell">Success Rate</th>
              <th className="py-2.5 pr-5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((c) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 pl-5 pr-4 text-gray-200 font-medium">{c.title}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${diffStyle[c.difficulty]}`}>
                    {c.difficulty}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-400 hidden sm:table-cell">
                  {c.attempts.toLocaleString()}
                </td>
                <td className="py-3 pr-4 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500/60 rounded-full"
                        style={{ width: `${c.successRate}%` }}
                      />
                    </div>
                    <span className="text-gray-400">{c.successRate}%</span>
                  </div>
                </td>
                <td className="py-3 pr-5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-xs text-blue-400 hover:underline">Edit</button>
                    <button
                      onClick={() => deleteChallenge(c.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChallengeTable;
