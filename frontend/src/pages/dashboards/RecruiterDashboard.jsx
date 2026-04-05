import React from 'react';
import RecruiterNavbar from '../../components/recruiter/RecruiterNavbar';
import RecruiterDashboardPage from '../recruiter/RecruiterDashboardPage';

const RecruiterDashboard = () => {
  let user = { username: 'Recruiter' };
  try {
    const stored = localStorage.getItem('user');
    if (stored) user = JSON.parse(stored);
  } catch (_) {}

  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      <RecruiterNavbar user={user} />
      <RecruiterDashboardPage />
    </div>
  );
};

export default RecruiterDashboard;
