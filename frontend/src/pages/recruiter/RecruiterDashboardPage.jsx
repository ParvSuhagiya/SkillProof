import React, { useState } from 'react';
import RecruiterStatCard from '../../components/recruiter/RecruiterStatCard';
import CandidateCard from '../../components/recruiter/CandidateCard';
import CreateChallengeForm from '../../components/recruiter/CreateChallengeForm';
import MyRatingPanel from '../../components/recruiter/MyRatingPanel';
import MyAdminsPanel from '../../components/recruiter/MyAdminsPanel';
import MessagingPanel from '../../components/admin/MessagingPanel';

// ─── Tabs ─────────────────────────────────────────────────────────
const TABS = ['Candidates', 'My Admins', 'Create Challenge', 'My Rating', 'Messages'];

// ─── Dummy candidate data (unchanged from original) ──────────────
const allCandidates = [
  { id: 1, name: 'Arjun Mehta',   location: 'Bangalore, IN', skills: ['Backend', 'DevOps'],     score: 870, successRate: 82, rank: 312, experience: 'Senior' },
  { id: 2, name: 'Priya Sharma',  location: 'Mumbai, IN',    skills: ['Frontend'],               score: 920, successRate: 88, rank: 102, experience: 'Senior' },
  { id: 3, name: 'Liu Wei',       location: 'Shanghai, CN',  skills: ['Fullstack', 'Backend'],   score: 760, successRate: 74, rank: 680, experience: 'Mid' },
  { id: 4, name: 'Sara El-Amin',  location: 'Dubai, AE',     skills: ['Frontend', 'Mobile'],     score: 810, successRate: 79, rank: 450, experience: 'Mid' },
  { id: 5, name: 'Carlos Ruiz',   location: 'Madrid, ES',    skills: ['ML', 'Backend'],          score: 695, successRate: 68, rank: 910, experience: 'Junior' },
  { id: 6, name: 'Emily Zhang',   location: 'Toronto, CA',   skills: ['Fullstack'],              score: 885, successRate: 85, rank: 230, experience: 'Senior' },
  { id: 7, name: 'Omar Farooq',   location: 'Karachi, PK',   skills: ['Backend', 'DevOps'],      score: 740, successRate: 71, rank: 720, experience: 'Junior' },
  { id: 8, name: 'Nadia Petrov',  location: 'Berlin, DE',    skills: ['Frontend', 'Fullstack'],  score: 830, successRate: 80, rank: 390, experience: 'Mid' },
];
const recentlyViewed   = ['Arjun Mehta', 'Priya Sharma', 'Emily Zhang'];
const recentShortlists = ['Priya Sharma', 'Emily Zhang'];
const SKILL_OPTIONS    = ['All', 'Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'ML'];
const EXP_OPTIONS      = ['All', 'Junior', 'Mid', 'Senior'];
const SCORE_OPTIONS    = [
  { label: 'All',       min: 0,   max: 1000 },
  { label: '800+',      min: 800, max: 1000 },
  { label: '700–800',   min: 700, max: 800  },
  { label: 'Below 700', min: 0,   max: 700  },
];

// ─── Compare Modal ────────────────────────────────────────────────
const CompareModal = ({ candidates, onClose }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
    <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-white">Candidate Comparison</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-white text-xs">✕ Close</button>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${candidates.length}, 1fr)` }}>
        {candidates.map((c) => (
          <div key={c.id} className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-white">{c.name}</p>
            <p className="text-xs text-gray-500">{c.location}</p>
            <hr className="border-white/5" />
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Score</span>
                <span className={`font-bold ${c.score >= 800 ? 'text-green-400' : c.score >= 600 ? 'text-yellow-400' : 'text-red-400'}`}>{c.score}/1000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Success Rate</span>
                <span className="text-gray-300 font-medium">{c.successRate}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Global Rank</span>
                <span className="text-gray-300 font-medium">#{c.rank}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Experience</span>
                <span className="text-gray-300 font-medium">{c.experience}</span>
              </div>
              <div className="flex justify-between items-start text-xs pt-1">
                <span className="text-gray-500">Skills</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {c.skills.map((s) => (
                    <span key={s} className="text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded text-xs">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Candidates Tab ───────────────────────────────────────────────
const CandidatesTab = () => {
  const [search,      setSearch]      = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [expFilter,   setExpFilter]   = useState('All');
  const [scoreFilter, setScoreFilter] = useState(0);
  const [shortlisted, setShortlisted] = useState(new Set([2, 6]));
  const [selected,    setSelected]    = useState(new Set());
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = allCandidates.filter((c) => {
    const scoreRange = SCORE_OPTIONS[scoreFilter];
    const nameMatch  = c.name.toLowerCase().includes(search.toLowerCase()) ||
                       c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const skillMatch = skillFilter === 'All' || c.skills.includes(skillFilter);
    const expMatch   = expFilter   === 'All' || c.experience === expFilter;
    const scoreMatch = c.score >= scoreRange.min && c.score < scoreRange.max;
    return nameMatch && skillMatch && expMatch && scoreMatch;
  });

  const toggleShortlist = (id) => setShortlisted((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSelect    = (id) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectedCandidates = allCandidates.filter((c) => selected.has(c.id));
  const canCompare = selected.size >= 2 && selected.size <= 3;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RecruiterStatCard label="Candidates Viewed"   value="143"  sub="This month" />
        <RecruiterStatCard label="Shortlisted"         value={shortlisted.size.toString()} sub="Across all searches" />
        <RecruiterStatCard label="Active Searches"     value="4"    sub="2 with new matches" />
        <RecruiterStatCard label="Avg Candidate Score" value="812"  sub="Out of 1000" />
      </div>

      <div className="bg-[#111] border border-white/10 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Search Candidates</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-[#0d0d0d] border border-white/10 px-3 py-2 rounded-md">
            <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input type="text" placeholder="Search by name or skill..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full" />
          </div>
          <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}
            className="bg-[#0d0d0d] border border-white/10 text-gray-400 text-xs rounded-md px-3 py-2 outline-none">
            {SKILL_OPTIONS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Skills' : s}</option>)}
          </select>
          <select value={scoreFilter} onChange={(e) => setScoreFilter(Number(e.target.value))}
            className="bg-[#0d0d0d] border border-white/10 text-gray-400 text-xs rounded-md px-3 py-2 outline-none">
            {SCORE_OPTIONS.map((s, i) => <option key={s.label} value={i}>{i === 0 ? 'Any Score' : `Score: ${s.label}`}</option>)}
          </select>
          <select value={expFilter} onChange={(e) => setExpFilter(e.target.value)}
            className="bg-[#0d0d0d] border border-white/10 text-gray-400 text-xs rounded-md px-3 py-2 outline-none">
            {EXP_OPTIONS.map((e) => <option key={e} value={e}>{e === 'All' ? 'All Levels' : e}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h2 className="text-sm font-semibold text-white">Candidates</h2>
            <p className="text-xs text-gray-600 mt-0.5">{filtered.length} results found</p>
          </div>
          {canCompare && (
            <button onClick={() => setCompareOpen(true)}
              className="text-xs font-medium text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded hover:bg-blue-500/10 transition">
              Compare {selected.size} Selected →
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className="text-gray-600 border-b border-white/5">
                <th className="py-2.5 pl-4 pr-2 text-left font-medium w-8"></th>
                <th className="py-2.5 pr-4 text-left font-medium">Name</th>
                <th className="py-2.5 pr-4 text-left font-medium">Skills</th>
                <th className="py-2.5 pr-4 text-left font-medium">Score</th>
                <th className="py-2.5 pr-4 text-left font-medium hidden md:table-cell">Success Rate</th>
                <th className="py-2.5 pr-4 text-left font-medium hidden lg:table-cell">Rank</th>
                <th className="py-2.5 pr-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <CandidateCard key={c.id} candidate={c} isSelected={selected.has(c.id)}
                    onSelect={toggleSelect} onShortlist={toggleShortlist} shortlisted={shortlisted.has(c.id)} />
                ))
              ) : (
                <tr><td colSpan={7} className="text-center py-10 text-gray-600 text-sm">No candidates match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-white/10 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Recently Viewed</h2>
          <ul className="space-y-2">
            {recentlyViewed.map((name) => (
              <li key={name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-gray-400 font-semibold">{name[0]}</div>
                  <span className="text-sm text-gray-300">{name}</span>
                </div>
                <button className="text-xs text-blue-400 hover:underline">View</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Recently Shortlisted</h2>
          <ul className="space-y-2">
            {recentShortlists.map((name) => (
              <li key={name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-400/10 flex items-center justify-center text-xs text-green-400 font-semibold">{name[0]}</div>
                  <span className="text-sm text-gray-300">{name}</span>
                </div>
                <span className="text-xs text-green-400">✓ Shortlisted</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {compareOpen && <CompareModal candidates={selectedCandidates} onClose={() => setCompareOpen(false)} />}
    </>
  );
};

// ─── Main Page ────────────────────────────────────────────────────
const RecruiterDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('Candidates');

  return (
    <main className="pt-14 min-h-screen bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-white">Recruiter Dashboard</h1>
          <p className="text-sm text-gray-600 mt-0.5">Search developers, manage challenges, and track your performance.</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-medium px-4 py-2 border-b-2 whitespace-nowrap transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-6">
          {activeTab === 'Candidates'        && <CandidatesTab />}
          {activeTab === 'My Admins'         && <MyAdminsPanel />}
          {activeTab === 'Create Challenge'  && <CreateChallengeForm onSuccess={() => {}} />}
          {activeTab === 'My Rating'         && <MyRatingPanel />}
          {activeTab === 'Messages'          && <MessagingPanel />}
        </div>

      </div>
    </main>
  );
};

export default RecruiterDashboardPage;
