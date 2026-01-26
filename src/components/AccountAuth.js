import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import "./AccountAuth.css";

export default function AccountAuth() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(""); // Clear message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignup) {
        // Sign up process
        const result = await register(formData);
        if (result.success) {
          setMessage("✅ Account created successfully! Redirecting...");
          setTimeout(() => navigate("/products"), 1500);
        } else {
          setMessage(`❌ ${result.error || "Registration failed"}`);
        }
      } else {
        // Login process
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setMessage(`👋 Welcome back, ${result.user?.name || "User"}!`);
          setTimeout(() => navigate("/products"), 1000);
        } else {
          setMessage(`❌ ${result.error || "Invalid email or password"}`);
        }
      }
    } catch (error) {
      setMessage(`❌ ${error.message || "An error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{isSignup ? "Create Account" : "Sign In"}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Please wait..." : (isSignup ? "Sign Up" : "Sign In")}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="auth-switch">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="auth-toggle"
          >
            {isSignup
              ? "Already have an account? Sign In"
              : "Don’t have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
