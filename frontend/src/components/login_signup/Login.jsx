import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLE_ROUTES = {
  admin:     "/admin-dashboard",
  recruiter: "/recruiter-dashboard",
  developer: "/developer-dashboard",
};

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials. Have you verified your email?");
        setLoading(false);
        return;
      }

      // Persist token + user info for use across the app
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect based on role returned by backend
      const role = data.user?.role;
      const destination = ROLE_ROUTES[role];

      if (destination) {
        navigate(destination, { replace: true });
      } else {
        setError(`Unknown role "${role}". Contact support.`);
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      <div className="w-full max-w-sm bg-[#0d0d0d] border border-gray-800 rounded-xl p-6 shadow-lg">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-1">Welcome Back</h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          Sign in to your SkillProof account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-xs text-center bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          {/* Email */}
          <div>
            <label className="text-xs text-gray-500">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2.5 text-sm rounded-md bg-[#111] border border-gray-800 focus:outline-none focus:border-white transition"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-500">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2.5 text-sm rounded-md bg-[#111] border border-gray-800 focus:outline-none focus:border-white transition"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-5">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-white cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;