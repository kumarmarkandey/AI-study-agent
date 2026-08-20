import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Compass, Database, Box, BrainCircuit, CheckCircle2, FileText, Bot, Layers } from "lucide-react";
import AIOrb3D from "../3D/AIOrb3D";
import "./hero.css";

function Hero() {
  const token = localStorage.getItem("token");

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="badge-3d">
          <Sparkles size={14} className="badge-sparkle" />
          <span>Next-Gen AI Study Companion Platform</span>
        </div>

        <h1 className="hero-title">
          Accelerate Your Learning with <span className="gradient-text">Intelligent Workspaces</span>.
        </h1>

        <p className="hero-description">
          Organize your courses into interactive study hubs. Convert raw notes into automated 
          multiple-choice quizzes, master definitions with 3D flashcards, and query your material with a context-aware AI tutor.
        </p>

        <div className="hero-feature-tags">
          <span className="feature-pill"><FileText size={13} /> Notes Vault</span>
          <span className="feature-pill"><Bot size={13} /> AI Tutor</span>
          <span className="feature-pill"><BrainCircuit size={13} /> Smart Quizzes</span>
          <span className="feature-pill"><Layers size={13} /> 3D Flashcards</span>
          <span className="feature-pill"><Database size={13} /> Cloud Sync</span>
        </div>

        <div className="hero-buttons">
          <Link to={token ? "/dashboard" : "/signup"} className="btn-3d-primary">
            <span>{token ? "Open Workspace" : "Get Started Free"}</span>
            <ArrowRight size={18} />
          </Link>

          <a href="#features" className="btn-3d-secondary">
            <Compass size={18} />
            <span>Explore Platform</span>
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-card glass-panel">
            <div className="stat-icon-hdr">
              <Database size={15} className="stat-icon-cyan" />
              <span className="stat-num">100%</span>
            </div>
            <span className="stat-label">Cloud Database Sync</span>
          </div>

          <div className="stat-card glass-panel">
            <div className="stat-icon-hdr">
              <Box size={15} className="stat-icon-indigo" />
              <span className="stat-num">3D</span>
            </div>
            <span className="stat-label">Interactive Visuals</span>
          </div>

          <div className="stat-card glass-panel">
            <div className="stat-icon-hdr">
              <BrainCircuit size={15} className="stat-icon-purple" />
              <span className="stat-num">AI</span>
            </div>
            <span className="stat-label">Quizzes & Flashcards</span>
          </div>
        </div>
      </div>

      <div className="hero-visual glass-card-3d">
        <div className="orb-preview-header">
          <span className="orb-dot red"></span>
          <span className="orb-dot yellow"></span>
          <span className="orb-dot green"></span>
          <span className="orb-title">AI Assistant Engine</span>
        </div>
        <AIOrb3D isThinking={false} />
        <div className="orb-caption">
          <p className="caption-text">"Ask questions about your notes, formulas, or key concepts."</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;