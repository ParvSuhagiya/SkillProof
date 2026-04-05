import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import AdminStatCard from '../../components/admin/AdminStatCard';
import UserTable from '../../components/admin/UserTable';
import ChallengeTable from '../../components/admin/ChallengeTable';
import RateRecruiterModal from '../../components/admin/RateRecruiterModal';
import MessagingPanel from '../../components/admin/MessagingPanel';
import CreateChallengeForm from '../../components/recruiter/CreateChallengeForm';
import api from '../../api/api';

// ─── Static data (overview charts) ──────────────────────────────
const userGrowthData = [
  { month: 'Oct', users: 120 }, { month: 'Nov', users: 210 },
  { month: 'Dec', users: 280 }, { month: 'Jan', users: 390 },
  { month: 'Feb', users: 520 }, { month: 'Mar', users: 710 },
  { month: 'Apr', users: 842 },
];
const attemptsData = [
  { month: 'Oct', attempts: 340  }, { month: 'Nov', attempts: 620  },
  { month: 'Dec', attempts: 910  }, { month: 'Jan', attempts: 1100 },
  { month: 'Feb', attempts: 1380 }, { month: 'Mar', attempts: 1740 },
  { month: 'Apr', attempts: 2050 },
];
const reports = [
  { id: 1, user: 'Carlos Ruiz',   reason: 'Unusual submission pattern — near-instant solutions', severity: 'High'   },
  { id: 2, user: 'Liu Wei',       reason: 'Multiple accounts detected from same IP',             severity: 'High'   },
  { id: 3, user: 'Omar Farooq',   reason: 'Reported by recruiter for copied portfolio',          severity: 'Medium' },
  { id: 4, user: 'Unknown_443',   reason: 'Bot-like activity — 200 requests in 2 minutes',      severity: 'High'   },
];
const severityStyle = {
  High:   'bg-red-400/10 text-red-400',
  Medium: 'bg-yellow-400/10 text-yellow-400',
  Low:    'bg-green-400/10 text-green-400',
};

// ─── Mini chart ──────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-400 font-medium">{label}</p>
      <p className="text-blue-400 font-semibold">{payload[0].value.toLocaleString()}</p>
    </div>
  );
  return null;
};
const MiniChart = ({ data, dataKey }) => (
  <ResponsiveContainer width="100%" height={140}>
    <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
      <defs>
        <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
      <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#4b5563' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 9, fill: '#4b5563' }} axisLine={false} tickLine={false} />
      <Tooltip content={<DarkTooltip />} />
      <Area type="monotone" dataKey={dataKey} stroke="#3b82f6" strokeWidth={1.6}
        fill={`url(#grad-${dataKey})`} dot={false} activeDot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} />
    </AreaChart>
  </ResponsiveContainer>
);

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = ['Overview', 'Recruiters', 'Developers', 'Messages'];

// ─── Recruiters Tab ──────────────────────────────────────────────
const RecruitersTab = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [ratingTarget, setRatingTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/admin/recruiters');
      setRecruiters(data.recruiters || []);
    } catch (err) {
      setError(err.message || 'Failed to load recruiters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const hire = async (recruiterId) => {
    setActionLoading(recruiterId);
    try {
      await api.post(`/admin/hire-recruiter/${recruiterId}`);
      load();
    } catch (err) {
      alert(err.message || 'Failed to hire recruiter');
    } finally {
      setActionLoading('');
    }
  };

  const fire = async (recruiterId) => {
    if (!confirm('Remove this recruiter from your team?')) return;
    setActionLoading(recruiterId);
    try {
      await api.delete(`/admin/fire-recruiter/${recruiterId}`);
      load();
    } catch (err) {
      alert(err.message || 'Failed to remove recruiter');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) return <p className="text-xs text-gray-600 text-center py-16">Loading recruiters...</p>;
  if (error)   return <p className="text-xs text-red-400 text-center py-16">{error}</p>;

  return (
    <>
      <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">All Recruiters</h2>
          <p className="text-xs text-gray-600 mt-0.5">{recruiters.length} recruiters on the platform</p>
        </div>

        {recruiters.length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-10">No recruiters registered yet.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {recruiters.map((r) => (
              <div key={r._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-white/[0.02] transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-sm text-blue-400 font-bold shrink-0">
                    {r.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{r.username}</p>
                    <p className="text-xs text-gray-600">{r.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {r.avgRating ? (
                        <span className="text-xs text-yellow-400">★ {r.avgRating} ({r.totalRatings})</span>
                      ) : (
                        <span className="text-xs text-gray-700">No ratings yet</span>
                      )}
                      <span className="text-xs text-gray-700">
                        {r.adminCount}/5 admins
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-12 sm:pl-0">
                  {r.alreadyHired ? (
                    <>
                      <button
                        onClick={() => setRatingTarget(r)}
                        className="text-xs text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded hover:bg-yellow-500/10 transition"
                      >
                        ★ Rate
                      </button>
                      <button
                        onClick={() => fire(r._id)}
                        disabled={actionLoading === r._id}
                        className="text-xs text-red-400 border border-red-500/20 px-2.5 py-1 rounded hover:bg-red-500/10 disabled:opacity-50 transition"
                      >
                        {actionLoading === r._id ? '...' : 'Remove'}
                      </button>
                      <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">Hired</span>
                    </>
                  ) : (
                    <button
                      onClick={() => hire(r._id)}
                      disabled={actionLoading === r._id || r.adminCount >= 5}
                      className="text-xs text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded hover:bg-blue-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      {actionLoading === r._id ? '...' : r.adminCount >= 5 ? 'Full (5/5)' : 'Hire'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Also show the challenge creation for admins */}
      <CreateChallengeForm onSuccess={() => {}} />

      {ratingTarget && (
        <RateRecruiterModal
          recruiter={ratingTarget}
          onClose={() => setRatingTarget(null)}
          onSuccess={load}
        />
      )}
    </>
  );
};

// ─── Developers Tab ──────────────────────────────────────────────
const DevelopersTab = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/developers')
      .then((d) => setDevelopers(d.developers || []))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-xs text-gray-600 text-center py-16">Loading developers...</p>;
  if (error)   return <p className="text-xs text-red-400 text-center py-16">{error}</p>;

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-white">All Developers</h2>
        <p className="text-xs text-gray-600 mt-0.5">Read-only view — admins cannot delete developers</p>
      </div>
      {developers.length === 0 ? (
        <p className="text-xs text-gray-600 text-center py-10">No developers registered yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="text-gray-600 border-b border-white/5">
                <th className="py-2.5 pl-5 pr-4 text-left font-medium">Developer</th>
                <th className="py-2.5 pr-4 text-left font-medium">Email</th>
                <th className="py-2.5 pr-4 text-left font-medium">Credibility Score</th>
                <th className="py-2.5 pr-4 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {developers.map((dev) => (
                <tr key={dev._id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="py-3 pl-5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-400/10 flex items-center justify-center text-xs text-green-400 font-bold">
                        {dev.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-200">{dev.username}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{dev.email}</td>
                  <td className="py-3 pr-4">
                    <span className={`font-semibold ${
                      dev.credibilityScore >= 700 ? 'text-green-400' :
                      dev.credibilityScore >= 400 ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {dev.credibilityScore}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{new Date(dev.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Overview Tab ────────────────────────────────────────────────
const OverviewTab = () => {
  const [reportList, setReportList] = useState(reports);
  const dismiss = (id) => setReportList((p) => p.filter((r) => r.id !== id));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Total Users"      value="1,842" sub="+34 this week"     accent="blue"   />
        <AdminStatCard label="Total Challenges" value="67"    sub="12 pending review" accent="green"  />
        <AdminStatCard label="Active Sessions"  value="304"   sub="Right now"         accent="yellow" />
        <AdminStatCard label="Flagged Reports"  value="4"     sub="3 high priority"   accent="red"    />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">User Growth</h2>
            <span className="text-xs text-gray-600">Last 7 months</span>
          </div>
          <MiniChart data={userGrowthData} dataKey="users" />
        </div>
        <div className="bg-[#111] border border-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Challenge Attempts</h2>
            <span className="text-xs text-gray-600">Last 7 months</span>
          </div>
          <MiniChart data={attemptsData} dataKey="attempts" />
        </div>
      </div>

      <UserTable />
      <ChallengeTable />

      <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Flagged Reports</h2>
          <p className="text-xs text-gray-600 mt-0.5">{reportList.length} open cases</p>
        </div>
        {reportList.length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-10">No flagged reports.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {reportList.map((r) => (
              <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-white/[0.02] transition">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 text-xs px-2 py-0.5 rounded font-medium shrink-0 ${severityStyle[r.severity]}`}>{r.severity}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{r.user}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pl-8 sm:pl-0">
                  <button className="text-xs text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded hover:bg-blue-500/10 transition">Review</button>
                  <button className="text-xs text-red-400 border border-red-500/20 px-2.5 py-1 rounded hover:bg-red-500/10 transition">Ban</button>
                  <button onClick={() => dismiss(r.id)} className="text-xs text-gray-500 border border-white/10 px-2.5 py-1 rounded hover:bg-white/5 transition">Ignore</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main component ──────────────────────────────────────────────
const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <main className="pt-14 min-h-screen bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-0.5">Manage your platform, recruiters, and hiring operations.</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-white/10 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-medium px-4 py-2 border-b-2 transition-colors -mb-px ${
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
          {activeTab === 'Overview'    && <OverviewTab />}
          {activeTab === 'Recruiters'  && <RecruitersTab />}
          {activeTab === 'Developers'  && <DevelopersTab />}
          {activeTab === 'Messages'    && <MessagingPanel />}
        </div>

      </div>
    </main>
  );
};

export default AdminDashboardPage;
