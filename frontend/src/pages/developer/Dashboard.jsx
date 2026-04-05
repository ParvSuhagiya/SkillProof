import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import StatCard from '../../components/developer/StatCard';
import ChallengeCard from '../../components/developer/ChallengeCard';

// ─── Dummy Data ───────────────────────────────────────────────

const stats = [
  { label: 'Challenges Attempted', value: '34',    sub: '+3 this week' },
  { label: 'Credibility Score',    value: '780',   sub: 'Out of 1000' },
  { label: 'Success Rate',         value: '71%',   sub: '24 / 34 passed' },
  { label: 'Global Rank',          value: '#1,204', sub: 'Top 12%' },
];

const recentActivity = [
  { id: 1, name: 'Two Sum',            status: 'Passed', score: 100, date: 'Apr 4, 2026' },
  { id: 2, name: 'Binary Search Tree', status: 'Failed', score: 40,  date: 'Apr 3, 2026' },
  { id: 3, name: 'Merge Intervals',    status: 'Passed', score: 90,  date: 'Apr 2, 2026' },
  { id: 4, name: 'LRU Cache',          status: 'Passed', score: 85,  date: 'Apr 1, 2026' },
  { id: 5, name: 'Valid Parentheses',  status: 'Failed', score: 55,  date: 'Mar 30, 2026' },
];

const recommendedChallenges = [
  {
    id: 1,
    title: 'Graph BFS / DFS',
    difficulty: 'Medium',
    description: 'Traverse a graph using breadth-first and depth-first search algorithms.',
  },
  {
    id: 2,
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    description: 'Find the maximum in every window of size k across an input array.',
  },
  {
    id: 3,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description: 'Reverse a singly linked list in-place and return the new head.',
  },
  {
    id: 4,
    title: 'Dynamic Programming – Knapsack',
    difficulty: 'Hard',
    description: 'Solve the 0/1 knapsack problem using bottom-up dynamic programming.',
  },
];

const performanceData = [
  { week: 'W1', score: 45 },
  { week: 'W2', score: 60 },
  { week: 'W3', score: 55 },
  { week: 'W4', score: 72 },
  { week: 'W5', score: 68 },
  { week: 'W6', score: 80 },
  { week: 'W7', score: 78 },
  { week: 'W8', score: 90 },
];

// ─── Custom Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 text-xs shadow-lg">
        <p className="font-medium text-gray-400">{label}</p>
        <p className="text-blue-400 font-semibold">Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// ─── Main Dashboard ───────────────────────────────────────────
const Dashboard = () => {
  return (
    <main className="pt-14 min-h-screen bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-0.5">Welcome back — here's your activity overview.</p>
        </div>

        {/* ── Stats ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
          ))}
        </div>

        {/* ── Two-column: Activity + Graph ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Recent Activity — 3 cols */}
          <div className="lg:col-span-3 bg-[#111] border border-white/10 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Recent Submissions</h2>
              <a href="#" className="text-xs text-blue-400 hover:underline">View all</a>
            </div>

            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-600 border-b border-white/5">
                  <th className="text-left font-medium pb-2">Challenge</th>
                  <th className="text-left font-medium pb-2">Status</th>
                  <th className="text-left font-medium pb-2">Score</th>
                  <th className="text-left font-medium pb-2 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentActivity.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 text-gray-300 font-medium pr-4">{item.name}</td>
                    <td className="py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          item.status === 'Passed'
                            ? 'bg-green-400/10 text-green-400'
                            : 'bg-red-400/10 text-red-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-400">{item.score}/100</td>
                    <td className="py-2.5 text-gray-600 hidden sm:table-cell">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance Graph — 2 cols */}
          <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Performance</h2>
              <span className="text-xs text-gray-600">Last 8 weeks</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={performanceData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#4b5563' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#4b5563' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={1.8}
                  fill="url(#scoreGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Recommended Challenges ────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recommended Challenges</h2>
            <a href="#" className="text-xs text-blue-400 hover:underline">Browse all</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedChallenges.map((c) => (
              <ChallengeCard
                key={c.id}
                title={c.title}
                difficulty={c.difficulty}
                description={c.description}
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
};

export default Dashboard;
