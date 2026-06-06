import React, { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    try {
      await login(email, password);
      const redirectTo = location.state?.from?.pathname || "/home";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setLocalError(err.message || "Invalid email or password");
    }
  };

  const displayError = localError || error;

  return (
    <div className="page active">
      <div className="page-container login-page-bg">
        <div className="image-area">
          <div className="separator"></div>
          <img src="https://i.postimg.cc/G3zQ1Z6k/c96e2345e11d55417c89b73976eddb73.jpg" alt="Medical" />
        </div>

        <div className="page-content">
          <div className="form-container">
            <div className="form-header">
              <img
                src="https://i.postimg.cc/dVxJWzgh/11111.png"
                className="logo_1"
                alt="Skeleti-X"
              />
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Sign in to your Skeleti-X account</p>
            </div>

            {displayError && (
              <div className="form-error" role="alert" style={{ color: "#dc2626", marginBottom: "1rem", fontSize: "0.9rem" }}>
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkbox-label">Remember me</span>
                </label>

                <Link to="/forgetpassword" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <p className="form-footer">
                Don't have an account?{" "}
                <Link to="/register" className="form-link">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
