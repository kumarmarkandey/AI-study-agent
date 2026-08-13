import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Canvas3D from "../../components/3D/Canvas3D";
import { API_BASE_URL } from "../../config/api";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 4) {
      setError("Password should be at least 4 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed.");
        return;
      }

      setMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Canvas3D variant="default" />
      <main className="signup-page">
        <div className="signup-card glass-card-3d">
          <div className="signup-header">
            <Link to="/" className="brand-back">
              ← StudySphere<span>AI 3D</span>
            </Link>
            <h1>Create Account</h1>
            <p>Start building your 3D study space today.</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            {error && <div className="form-error-alert">{error}</div>}
            {message && <div className="form-success-alert">{message}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Alex Turner"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-3d-primary signup-submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create 3D Workspace Account ✨"}
            </button>
          </form>

          <p className="login-text">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default Signup;