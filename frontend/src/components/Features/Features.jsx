import { BookOpen, Bot, Brain, Layers } from "lucide-react";
import "./Features.css";

function Features() {
  const features = [
    {
      icon: <BookOpen size={28} className="feat-icon-indigo" />,
      title: "3D Subject Workspace",
      description:
        "Organize your learning into interactive 3D subject hubs with live database synchronization.",
      badge: "Real-time DB",
    },
    {
      icon: <Bot size={28} className="feat-icon-purple" />,
      title: "Context-Aware AI Chat",
      description:
        "Chat with a holographic 3D AI companion that analyzes your subject notes & study materials.",
      badge: "AI Hologram",
    },
    {
      icon: <Brain size={28} className="feat-icon-cyan" />,
      title: "Smart AI Quiz Generator",
      description:
        "Instantly turn your subject content into multiple-choice quizzes with detailed explanations.",
      badge: "Interactive MCQs",
    },
    {
      icon: <Layers size={28} className="feat-icon-rose" />,
      title: "3D Flip Flashcards",
      description:
        "Master key concepts using interactive 3D flipping flashcards with active recall mastery tracking.",
      badge: "3D Flip FX",
    },
  ];

  return (
    <section id="features" className="features">
      <div className="features-heading">
        <span className="section-tag">POWERFUL 3D STUDY ENGINE</span>
        <h2>Everything You Need to Ace Your Studies</h2>
        <p>
          Combine cutting-edge WebGL 3D graphics, intelligent AI models, and real-time database storage.
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