import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, LogIn, UserPlus, Menu, X, Sparkles, Globe } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  return (
    <header className="navbar-container">
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <span className="logo-brand">STUDY<span className="logo-red">SPHERE</span></span>
          <span className="logo-badge">AI</span>
        </Link>

        <div className="navbar-actions">
          <div className="lang-select-box">
            <Globe size={15} className="globe-icon" />
            <select className="lang-dropdown" aria-label="Language selector">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          {token ? (
            <Link to="/dashboard" className="btn-netflix-primary btn-nav-action">
              <LayoutDashboard size={16} />
              <span>Workspace</span>
            </Link>
          ) : (
            <Link to="/login" className="btn-netflix-primary btn-nav-action">
              <LogIn size={16} />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu glass-panel">
          <div className="mobile-actions">
            {token ? (
              <Link
                to="/dashboard"
                className="btn-netflix-primary mobile-btn-full"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Go to Workspace</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-netflix-primary mobile-btn-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="btn-netflix-secondary mobile-btn-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserPlus size={18} />
                  <span>Create Free Account</span>
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