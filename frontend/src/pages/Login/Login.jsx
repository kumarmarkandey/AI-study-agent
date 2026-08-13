import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Canvas3D from "../../components/3D/Canvas3D";
import { API_BASE_URL } from "../../config/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the backend server. Please verify MySQL & server are running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Canvas3D variant="default" />
      <main className="login-page">
        <div className="login-card glass-card-3d">
          <div className="login-header">
            <Link to="/" className="brand-back">
              ← StudySphere<span>AI 3D</span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Login to access your 3D study workspace.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="form-error-alert">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-3d-primary login-submit" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In ✨"}
            </button>
          </form>

          <p className="signup-text">
            Don't have an account? <Link to="/signup">Create one now</Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default Login;