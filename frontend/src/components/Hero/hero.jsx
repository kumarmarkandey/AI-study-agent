import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import AIOrb3D from "../3D/AIOrb3D";
import "./hero.css";

function Hero() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (token) {
      navigate("/dashboard");
    } else {
      navigate(`/signup?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <section className="hero-netflix">
      <div className="hero-vignette-overlay"></div>
      
      <div className="hero-container">
        <div className="hero-text-content">
          <div className="netflix-tag">
            <Zap size={14} className="tag-icon" />
            <span>AI-POWERED ACADEMIC ENGINE 2.0</span>
          </div>

          <h1 className="netflix-hero-title">
            Unlimited Knowledge, AI Tutoring & 3D Study Workspaces.
          </h1>

          <p className="netflix-hero-subtitle">
            Master any course material faster. Interactive notes, 3D flashcards & instant automated quizzes.
          </p>

          <form className="netflix-cta-form" onSubmit={handleGetStarted}>
            <p className="cta-prompt-text">
              Ready to excel in your studies? Enter your email to create or launch your workspace.
            </p>

            <div className="input-group-netflix">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!token}
                className="netflix-email-input"
              />
              <button type="submit" className="btn-netflix-primary btn-get-started">
                <span>{token ? "Open Workspace" : "Get Started"}</span>
                <ChevronRight size={22} />
              </button>
            </div>
          </form>

          <div className="hero-trust-badges">
            <span><ShieldCheck size={14} /> Instant Cloud Sync</span>
            <span className="badge-divider">•</span>
            <span><Sparkles size={14} /> Active Recall Workflows</span>
            <span className="badge-divider">•</span>
            <span>Zero Setup Required</span>
          </div>
        </div>

        <div className="hero-preview-frame">
          <div className="preview-top-bar">
            <div className="window-controls">
              <span className="control-dot red"></span>
              <span className="control-dot yellow"></span>
              <span className="control-dot green"></span>
            </div>
            <span className="window-title">StudySphere Holographic Engine</span>
          </div>
          <div className="orb-wrapper-hero">
            <AIOrb3D isThinking={false} />
          </div>
        </div>
      </div>

      <div className="netflix-bottom-curve"></div>
    </section>
  );
}

export default Hero;