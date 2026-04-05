import React from 'react';
import Navbar from '../../components/developer/Navbar';
import Dashboard from '../developer/Dashboard';

const DeveloperDashboard = () => {
  // User info is stored in localStorage at login time
  let user = { username: 'Developer' };
  try {
    const stored = localStorage.getItem('user');
    if (stored) user = JSON.parse(stored);
  } catch (_) {}

  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      <Navbar user={user} />
      <Dashboard />
    </div>
  );
};

export default DeveloperDashboard;

