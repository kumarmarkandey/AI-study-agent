import { BookOpen, Bot, Brain, Layers, FileText, Link2 } from "lucide-react";
import "./Features.css";

function Features() {
  const features = [
    {
      icon: <BookOpen size={22} className="feat-icon-indigo" />,
      title: "Subject Workspace Hubs",
      description:
        "Organize your courses into structured subject workspaces with instant cloud database sync and progress metrics.",
      badge: "Cloud Sync",
    },
    {
      icon: <Bot size={22} className="feat-icon-purple" />,
      title: "Context-Aware AI Tutor",
      description:
        "Query an intelligent AI assistant that reads your subject notes and materials to provide instant answers and explanations.",
      badge: "AI Powered",
    },
    {
      icon: <Brain size={22} className="feat-icon-cyan" />,
      title: "Automated Quiz Engine",
      description:
        "Turn raw notes into multiple-choice quizzes with automated grading, instant score badges, and detailed question breakdowns.",
      badge: "Smart MCQs",
    },
    {
      icon: <Layers size={22} className="feat-icon-rose" />,
      title: "3D Active Recall Flashcards",
      description:
        "Master formulas, terms, and definitions using 3D flipping flashcards equipped with keyboard controls and deck filters.",
      badge: "Active Recall",
    },
    {
      icon: <FileText size={22} className="feat-icon-green" />,
      title: "Note Reader & Instant Search",
      description:
        "Filter through notes instantly with live search and open comprehensive full-screen note reader modals.",
      badge: "Instant Search",
    },
    {
      icon: <Link2 size={22} className="feat-icon-amber" />,
      title: "Resource & Reference Vault",
      description:
        "Store external course links, documentation, and video resources with smart HTTPS formatting and link previews.",
      badge: "Resource Links",
    },
  ];

  return (
    <section id="features" className="features">
      <div className="features-heading">
        <span className="section-tag">COMPREHENSIVE STUDY TOOLKIT</span>
        <h2>Everything Required for Top Academic Performance</h2>
        <p>
          Seamlessly combine active recall workflows, AI tutoring, interactive 3D flashcards, and cloud database storage.
        </p>
      </div>

      <div className="feature-grid">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card glass-card-3d">
            <div className="feature-badge">{feature.badge}</div>
            <div className="feature-icon-wrapper">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;