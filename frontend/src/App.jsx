import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from "./components/login_signup/Login";
import Signup from "./components/login_signup/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import RecruiterDashboard from "./pages/dashboards/RecruiterDashboard";
import DeveloperDashboard from "./pages/dashboards/DeveloperDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/recruiter-dashboard" element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        } />
        <Route path="/developer-dashboard" element={
          <ProtectedRoute allowedRole="developer">
            <DeveloperDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

