import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer glass-panel">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            StudySphere<span className="logo-ai">AI</span> <span>3D</span>
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
        <p>© {new Date().getFullYear()} StudySphere AI 3D. All rights reserved. Ready for Production.</p>
      </div>
    </footer>
  );
}

export default Footer;