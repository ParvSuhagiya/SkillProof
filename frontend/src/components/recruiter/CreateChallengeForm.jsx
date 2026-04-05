import React, { useState } from 'react';
import api from '../../api/api';

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFFICULTY_COLORS = {
  easy: 'text-green-400 bg-green-400/10 border-green-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  hard: 'text-red-400 bg-red-400/10 border-red-400/20'
};

const CreateChallengeForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    tags: '',
    timeLimitSeconds: 3600,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required');
      return;
    }

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      await api.post('/challenges', {
        title: form.title.trim(),
        description: form.description.trim(),
        difficulty: form.difficulty,
        tags,
        timeLimitSeconds: Number(form.timeLimitSeconds),
      });
      setSuccess('Challenge created successfully!');
      setForm({ title: '', description: '', difficulty: 'medium', tags: '', timeLimitSeconds: 3600 });
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white">Create Challenge</h2>
        <p className="text-xs text-gray-500 mt-0.5">Add a new coding challenge to the platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Challenge Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Two Sum, Binary Search Tree..."
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:border-blue-500/50 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Describe the problem, constraints, and expected output..."
            rows={5}
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none resize-none focus:border-blue-500/50 transition"
          />
        </div>

        {/* Difficulty + Time Limit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Difficulty *</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set('difficulty', d)}
                  className={`flex-1 text-xs border rounded px-2 py-1.5 font-medium capitalize transition ${
                    form.difficulty === d
                      ? DIFFICULTY_COLORS[d]
                      : 'text-gray-500 border-white/10 hover:bg-white/5'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Time Limit</label>
            <select
              value={form.timeLimitSeconds}
              onChange={(e) => set('timeLimitSeconds', e.target.value)}
              className="w-full bg-[#0d0d0d] border border-white/10 text-gray-400 text-xs rounded-md px-3 py-2 outline-none"
            >
              <option value={1800}>30 minutes</option>
              <option value={3600}>1 hour</option>
              <option value={7200}>2 hours</option>
              <option value={10800}>3 hours</option>
              <option value={86400}>24 hours</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
            Tags <span className="text-gray-600">(comma-separated)</span>
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="e.g. arrays, dynamic-programming, graphs"
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:border-blue-500/50 transition"
          />
          {form.tags && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.tags.split(',').filter((t) => t.trim()).map((t, i) => (
                <span key={i} className="text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded">
                  {t.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Feedback */}
        {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded">{error}</p>}
        {success && <p className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-2 rounded">{success}</p>}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setForm({ title: '', description: '', difficulty: 'medium', tags: '', timeLimitSeconds: 3600 })}
            className="text-xs text-gray-400 border border-white/10 px-4 py-2 rounded hover:bg-white/5 transition"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 text-xs text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded transition font-medium"
          >
            {loading ? 'Creating...' : 'Create Challenge'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateChallengeForm;
