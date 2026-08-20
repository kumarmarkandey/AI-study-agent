import { Link } from "react-router-dom";
import { Box, Sparkles } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer glass-panel">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Box size={20} className="logo-box-icon" />
            <span>StudySphere</span>
            <span className="logo-ai">AI</span>
            <span className="badge-3d-tag">
              <Sparkles size={10} /> 3D
            </span>
          </Link>
          <p>The ultimate 3D visual study companion powered by artificial intelligence.</p>
        </div>

        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/login">Sign In</Link>
          <Link to="/signup">Register</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} StudySphere AI 3D. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;