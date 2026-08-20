import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, LayoutDashboard, LogIn, UserPlus, Menu, X, Box } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  return (
    <header className="navbar-container">
      <nav className="navbar glass-panel">
        <Link to="/" className="navbar-logo">
          <Box className="logo-box-icon" size={22} />
          <span>StudySphere</span>
          <span className="logo-ai">AI</span>
          <span className="badge-3d-tag">
            <Sparkles size={11} /> 3D
          </span>
        </Link>

        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="navbar-actions">
          {token ? (
            <Link to="/dashboard" className="btn-3d-primary">
              <LayoutDashboard size={16} />
              <span>Workspace</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
              <Link to="/signup" className="btn-3d-primary">
                <UserPlus size={16} />
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu glass-panel">
          <a href="#features" className="mobile-link" onClick={() => setMenuOpen(false)}>
            Features
          </a>
          <a href="#how-it-works" className="mobile-link" onClick={() => setMenuOpen(false)}>
            How It Works
          </a>
          <a href="#about" className="mobile-link" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <div className="mobile-actions">
            {token ? (
              <Link
                to="/dashboard"
                className="btn-3d-primary mobile-btn-full"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-3d-secondary mobile-btn-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="btn-3d-primary mobile-btn-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserPlus size={18} />
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;