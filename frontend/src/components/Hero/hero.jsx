import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Compass, Database, Box, BrainCircuit } from "lucide-react";
import AIOrb3D from "../3D/AIOrb3D";
import "./hero.css";

function Hero() {
  const token = localStorage.getItem("token");

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="badge-3d">
          <span className="badge-pulse"></span>
          <Sparkles size={14} className="badge-sparkle" />
          <span>Next-Gen 3D AI Study Companion</span>
        </div>

        <h1 className="hero-title">
          Learn Smarter in <span className="gradient-text">3D Space</span>, Powered by Real AI.
        </h1>

        <p className="hero-description">
          Transform your notes into interactive 3D study workspaces. Chat with AI,
          generate smart quizzes, master 3D flashcards, and track your progress in real-time.
        </p>

        <div className="hero-buttons">
          <Link to={token ? "/dashboard" : "/signup"} className="btn-3d-primary">
            <span>{token ? "Open 3D Workspace" : "Get Started Free"}</span>
            <ArrowRight size={18} />
          </Link>

          <a href="#features" className="btn-3d-secondary">
            <Compass size={18} />
            <span>Explore 3D Tools</span>
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-card glass-panel">
            <div className="stat-icon-hdr">
              <Database size={16} className="stat-icon-cyan" />
              <span className="stat-num gradient-text">100%</span>
            </div>
            <span className="stat-label">Live DB Sync</span>
          </div>

          <div className="stat-card glass-panel">
            <div className="stat-icon-hdr">
              <Box size={16} className="stat-icon-indigo" />
              <span className="stat-num gradient-text">3D</span>
            </div>
            <span className="stat-label">WebGL Visuals</span>
          </div>

          <div className="stat-card glass-panel">
            <div className="stat-icon-hdr">
              <BrainCircuit size={16} className="stat-icon-purple" />
              <span className="stat-num gradient-text">AI</span>
            </div>
            <span className="stat-label">Quiz & Flashcards</span>
          </div>
        </div>
      </div>

      <div className="hero-visual glass-card-3d">
        <div className="orb-preview-header">
          <span className="orb-dot red"></span>
          <span className="orb-dot yellow"></span>
          <span className="orb-dot green"></span>
          <span className="orb-title">AI Holographic Core</span>
        </div>
        <AIOrb3D isThinking={false} />
        <div className="orb-caption">
          <p className="caption-text">"Ask me anything about your notes, formulas, or concepts."</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;