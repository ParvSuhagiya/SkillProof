import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] = useState("developer");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const roles = [
    {
      id: "developer",
      title: "Developer",
      desc: "Solve challenges and prove your skills",
    },
    {
      id: "recruiter",
      title: "Recruiter",
      desc: "Find verified developers",
    },
    {
      id: "admin",
      title: "Admin",
      desc: "Manage platform",
    },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: selectedRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      // Show OTP modal on success
      setShowOTP(true);
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid OTP.");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Failed to verify email.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10 relative">
      
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-2">Create Account</h1>
      <p className="text-white/60 mb-10">
        Join SkillProof and verify your skills
      </p>

      {/* Role Selection */}
      <div className="w-full max-w-5xl mb-10">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Choose Your Role
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`
                  cursor-pointer rounded-2xl p-6 border transition-all duration-300
                  ${
                    isSelected
                      ? "bg-white text-black border-white scale-105"
                      : "bg-black text-white border-white/30 hover:border-white"
                  }
                `}
              >
                <h3 className="text-xl font-semibold mb-2">
                  {role.title}
                </h3>

                <p
                  className={`text-sm ${
                    isSelected ? "text-black/70" : "text-white/60"
                  }`}
                >
                  {role.desc}
                </p>

                {isSelected && (
                  <div className="mt-4 text-sm font-medium">
                    ✓ Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Signup Form */}
      <div className="w-full max-w-md border border-white/20 rounded-2xl p-8">
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          
          {/* Name */}
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Full Name (Username)"
            required
            className="bg-black border border-white/30 rounded-lg px-4 py-3 outline-none focus:border-white"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="bg-black border border-white/30 rounded-lg px-4 py-3 outline-none focus:border-white"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="bg-black border border-white/30 rounded-lg px-4 py-3 outline-none focus:border-white"
          />

          {/* Button */}
          <button
            type="submit"
            className="bg-white text-black font-semibold py-3 rounded-lg hover:opacity-90 transition cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-white/60 text-sm text-center mt-6">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-white cursor-pointer underline">
            Login
          </span>
        </p>
      </div>

      {/* OTP Modal */}
      {showOTP && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/20 p-8 rounded-2xl w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-2 text-center">Verify Email</h2>
            <p className="text-white/60 text-sm text-center mb-6">
              Enter the OTP sent to {form.email}
            </p>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter OTP Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="bg-black border border-white/30 text-center text-lg tracking-widest rounded-lg px-4 py-3 outline-none focus:border-white"
              />
              
              <button
                type="submit"
                className="bg-white text-black font-semibold py-3 rounded-lg hover:opacity-90 transition cursor-pointer"
              >
                Verify and Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;