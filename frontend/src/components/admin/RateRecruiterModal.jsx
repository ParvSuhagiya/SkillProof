import React, { useState } from 'react';
import api from '../../api/api';

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className={`text-xl transition-colors ${
          star <= value ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

const RateRecruiterModal = ({ recruiter, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post(`/admin/rate-recruiter/${recruiter._id}`, { value: rating, feedback });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Rate Recruiter</h2>
            <p className="text-xs text-gray-500 mt-0.5">{recruiter.username}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-2">Rating</label>
            <StarRating value={rating} onChange={setRating} />
            {rating > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2">
              Feedback <span className="text-gray-600">(optional)</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback..."
              rows={3}
              maxLength={500}
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none resize-none focus:border-blue-500/50 transition"
            />
            <p className="text-xs text-gray-600 mt-1 text-right">{feedback.length}/500</p>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-xs text-gray-400 border border-white/10 px-4 py-2 rounded hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-xs text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded transition font-medium"
            >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateRecruiterModal;
