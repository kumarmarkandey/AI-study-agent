import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  return (
    <header className="navbar-container">
      <nav className="navbar glass-panel">
        <Link to="/" className="navbar-logo">
          StudySphere<span className="logo-ai">AI</span> <span>3D</span>
        </Link>

        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="navbar-actions">
          {token ? (
            <Link to="/dashboard" className="btn-3d-primary">
              Go to Dashboard ✨
            </Link>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Sign In
              </Link>
              <Link to="/signup" className="btn-3d-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu glass-panel">
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          {token ? (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;