import React from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminDashboardPage from '../admin/AdminDashboardPage';

const AdminDashboard = () => {
  let user = { username: 'Admin' };
  try {
    const stored = localStorage.getItem('user');
    if (stored) user = JSON.parse(stored);
  } catch (_) {}

  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      <AdminNavbar user={user} />
      <AdminDashboardPage />
    </div>
  );
};

export default AdminDashboard;
