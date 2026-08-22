import { BookOpen, Bot, Brain, Layers, FileText, Link2, Sparkles, CheckCircle2 } from "lucide-react";
import "./Features.css";

function Features() {
  const showcaseItems = [
    {
      id: "ai-tutor",
      tag: "AI TUTORING ENGINE",
      title: "Query your AI tutor right inside your notes.",
      description:
        "Upload static lecture notes or course materials and get an instant, context-aware AI tutor that explains complex formulas, summarizes key themes, and answers queries 24/7.",
      bullets: ["Context-aware responses", "Math & code explanation support", "Instant summary generation"],
      visualType: "tutor",
    },
    {
      id: "3d-flashcards",
      tag: "ACTIVE RECALL WORKFLOWS",
      title: "Master terms & key concepts with 3D flashcards.",
      description:
        "Transform raw definitions into interactive 3D flipping flashcards with Spaced Repetition System (SRS) algorithms to maximize long-term memory retention.",
      bullets: ["3D card flip animation", "Custom deck categories", "Keyboard quick navigation"],
      visualType: "flashcards",
    },
    {
      id: "smart-quizzes",
      tag: "AUTOMATED TESTING",
      title: "Generate smart quizzes in seconds.",
      description:
        "Test your knowledge before exams with automatically generated multiple-choice quizzes complete with instant score metrics and explanation breakdowns.",
      bullets: ["Automated MCQ generator", "Live score badges & timers", "Detailed score analytics"],
      visualType: "quizzes",
    },
    {
      id: "cloud-sync",
      tag: "SUBJECT WORKSPACES",
      title: "Keep all your courses organized in one vault.",
      description:
        "Structure all your subjects, notes, external documentation, and video reference links into clean cloud-synced workspace hubs.",
      bullets: ["Cloud database synchronization", "Fast live search & tags", "Resource & reference vault"],
      visualType: "workspace",
    },
  ];

  return (
    <section id="features" className="features-netflix">
      <hr className="netflix-divider" />

      {showcaseItems.map((item, index) => (
        <div key={item.id}>
          <div className={`showcase-row ${index % 2 === 1 ? "reverse" : ""}`}>
            <div className="showcase-text">
              <span className="showcase-tag">{item.tag}</span>
              <h2 className="showcase-title">{item.title}</h2>
              <p className="showcase-desc">{item.description}</p>
              
              <ul className="showcase-bullet-list">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="showcase-visual-frame glass-panel">
              <div className="visual-top-bar">
                <div className="window-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="window-label">StudySphere Module • {item.tag}</span>
              </div>

              <div className="visual-content-body">
                {item.visualType === "tutor" && (
                  <div className="mockup-chat-preview">
                    <div className="chat-bubble user">"Explain the derivative formula in simple terms."</div>
                    <div className="chat-bubble ai">
                      <Sparkles size={14} className="sparkle-chat" />
                      <span>"The derivative represents the instantaneous rate of change of a function with respect to a variable..."</span>
                    </div>
                  </div>
                )}

                {item.visualType === "flashcards" && (
                  <div className="mockup-card-preview">
                    <div className="flashcard-3d-mock">
                      <span className="card-lbl">KEY TERM</span>
                      <h4 className="card-term">Photosynthesis</h4>
                      <span className="card-hint">Press Space to flip ↺</span>
                    </div>
                  </div>
                )}

                {item.visualType === "quizzes" && (
                  <div className="mockup-quiz-preview">
                    <div className="quiz-header-mock">
                      <span>Question 1 of 5</span>
                      <span className="badge-quiz-score">Score: 100%</span>
                    </div>
                    <p className="quiz-q-text">What is the primary function of mitochondria?</p>
                    <div className="quiz-options-mock">
                      <div className="quiz-opt correct">✓ Energy Production (ATP)</div>
                      <div className="quiz-opt">Protein Synthesis</div>
                    </div>
                  </div>
                )}

                {item.visualType === "workspace" && (
                  <div className="mockup-workspace-preview">
                    <div className="workspace-grid-mock">
                      <div className="ws-chip active">📘 Computer Science</div>
                      <div className="ws-chip">🧪 Organic Chemistry</div>
                      <div className="ws-chip">📐 Advanced Calculus</div>
                    </div>
                    <div className="ws-status-bar">
                      <span>Cloud Sync Status: <strong className="green-txt">Online</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="netflix-divider" />
        </div>
      ))}
    </section>
  );
}

export default Features;