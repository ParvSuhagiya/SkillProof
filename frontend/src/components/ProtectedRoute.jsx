import React from 'react';
import { Navigate } from 'react-router-dom';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ROLE_ROUTES = {
  admin:     '/admin-dashboard',
  recruiter: '/recruiter-dashboard',
  developer: '/developer-dashboard',
};

/**
 * ProtectedRoute
 * @param {string} [allowedRole] - If provided, redirects to correct dashboard if role mismatch
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('accessToken');

  if (isTokenExpired(token)) {
    localStorage.removeItem('accessToken');
    return <Navigate to="/login" replace />;
  }

  // Role-guard: redirect to the correct dashboard if user has the wrong role
  if (allowedRole) {
    let userRole = null;
    try {
      userRole = JSON.parse(localStorage.getItem('user'))?.role;
    } catch {}

    if (userRole && userRole !== allowedRole) {
      const correctRoute = ROLE_ROUTES[userRole] || '/login';
      return <Navigate to={correctRoute} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

