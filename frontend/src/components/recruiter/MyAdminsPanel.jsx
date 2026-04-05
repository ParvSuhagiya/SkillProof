import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const MyAdminsPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/recruiter/my-admins')
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load admins'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-xs text-gray-600 py-10 text-center">Loading...</p>;
  if (error) return <p className="text-xs text-red-400 py-10 text-center">{error}</p>;

  const { admins = [], count = 0, maxAllowed = 5 } = data || {};

  return (
    <div className="space-y-4">
      {/* Capacity bar */}
      <div className="bg-[#111] border border-white/10 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Admin Associations</h2>
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
            count >= maxAllowed
              ? 'bg-red-400/10 text-red-400'
              : 'bg-green-400/10 text-green-400'
          }`}>
            {count} / {maxAllowed}
          </span>
        </div>
        <div className="bg-white/5 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              count >= maxAllowed ? 'bg-red-400' : 'bg-green-400'
            }`}
            style={{ width: `${(count / maxAllowed) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1.5">
          {count >= maxAllowed
            ? 'Maximum capacity reached. Cannot accept more admin associations.'
            : `You can accept ${maxAllowed - count} more admin${maxAllowed - count !== 1 ? 's' : ''}.`}
        </p>
      </div>

      {/* Admin list */}
      <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Your Admins</h2>
          <p className="text-xs text-gray-500 mt-0.5">Companies you work with</p>
        </div>

        {admins.length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-10">
            No admins have hired you yet.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {admins.map((admin) => (
              <div key={admin._id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-sm text-blue-400 font-bold shrink-0">
                    {admin.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{admin.username}</p>
                    <p className="text-xs text-gray-600">{admin.email}</p>
                    {admin.bio && (
                      <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{admin.bio}</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-xs text-gray-600">
                    Since {new Date(admin.hiredAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAdminsPanel;
