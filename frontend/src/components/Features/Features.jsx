import { BookOpen, Bot, Brain, Layers } from "lucide-react";
import "./Features.css";

function Features() {
  const features = [
    {
      icon: <BookOpen size={24} className="feat-icon-indigo" />,
      title: "Subject Workspace Hubs",
      description:
        "Organize your learning into dedicated subject workspaces with live cloud database synchronization.",
      badge: "Real-time Sync",
    },
    {
      icon: <Bot size={24} className="feat-icon-purple" />,
      title: "Context-Aware AI Chat",
      description:
        "Chat with an AI companion that reads and synthesizes your subject notes & study materials.",
      badge: "AI Powered",
    },
    {
      icon: <Brain size={24} className="feat-icon-cyan" />,
      title: "Smart AI Quiz Generator",
      description:
        "Instantly convert subject notes into multiple-choice quizzes with instant grading & review.",
      badge: "Smart MCQs",
    },
    {
      icon: <Layers size={24} className="feat-icon-rose" />,
      title: "Interactive 3D Flashcards",
      description:
        "Master key definitions using interactive 3D flipping flashcards with spaced review tracking.",
      badge: "Active Recall",
    },
  ];

  return (
    <section id="features" className="features">
      <div className="features-heading">
        <span className="section-tag">INTELLIGENT STUDY PLATFORM</span>
        <h2>Everything You Need to Master Your Courses</h2>
        <p>
          Seamlessly integrate AI study tools, active recall workflows, and secure cloud storage.
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