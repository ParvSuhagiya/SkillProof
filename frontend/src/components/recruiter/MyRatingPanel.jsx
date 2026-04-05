import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const StarDisplay = ({ value, size = 'sm' }) => {
  const sz = size === 'lg' ? 'text-2xl' : 'text-sm';
  return (
    <div className={`flex gap-0.5 ${sz}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(value) ? 'text-yellow-400' : 'text-gray-700'}>
          ★
        </span>
      ))}
    </div>
  );
};

const MyRatingPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/recruiter/my-rating')
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load ratings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-xs text-gray-600 py-10 text-center">Loading ratings...</p>;
  if (error) return <p className="text-xs text-red-400 py-10 text-center">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="bg-[#111] border border-white/10 rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-white">
            {data?.avgRating ?? '—'}
          </p>
          <StarDisplay value={data?.avgRating || 0} size="lg" />
          <p className="text-xs text-gray-500 mt-1">
            {data?.totalRatings || 0} {data?.totalRatings === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        <div className="w-px h-16 bg-white/10 hidden sm:block" />

        <div className="flex-1">
          {data?.totalRatings === 0 ? (
            <p className="text-sm text-gray-500">No ratings received yet.</p>
          ) : (
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = data.ratings.filter((r) => r.value === star).length;
                const pct = data.totalRatings > 0 ? (count / data.totalRatings) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 w-5">{star}★</span>
                    <div className="flex-1 bg-white/5 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-yellow-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-gray-600 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Individual reviews */}
      {data?.ratings?.length > 0 && (
        <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Individual Reviews</h2>
          </div>
          <div className="divide-y divide-white/5">
            {data.ratings.map((r) => (
              <div key={r._id} className="px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-gray-400 font-bold">
                      {r.adminUsername?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-gray-300">{r.adminUsername}</span>
                  </div>
                  <StarDisplay value={r.value} />
                </div>
                {r.feedback && (
                  <p className="text-xs text-gray-500 mt-1 pl-8">{r.feedback}</p>
                )}
                <p className="text-xs text-gray-700 mt-1 pl-8">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRatingPanel;
