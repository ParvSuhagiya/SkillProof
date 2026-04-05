import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecruiterNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d] border-b border-white/10 h-14">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-6">

        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8 shrink-0">
          <span className="text-base font-bold text-white tracking-tight">SkillProof</span>
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Dashboard', active: true },
              { label: 'Candidates', active: false },
              { label: 'Shortlisted', active: false },
            ].map(({ label, active }) => (
              <a
                key={label}
                href="#"
                className={`text-sm font-medium transition-colors ${
                  active ? 'text-blue-400' : 'text-gray-500 hover:text-gray-200'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: Search + Notif + Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md w-52">
            <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search candidates..."
              className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
            />
          </div>

          <button className="relative p-1.5 text-gray-500 hover:text-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors pl-1"
            >
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-300">
                {user?.username?.[0]?.toUpperCase() || 'R'}
              </div>
              <span className="hidden sm:inline">{user?.username || 'Recruiter'}</span>
              <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl py-1 z-50">
                <a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5">Settings</a>
                <hr className="my-1 border-white/10" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RecruiterNavbar;
