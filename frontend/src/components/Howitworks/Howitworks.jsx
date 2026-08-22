import "./Howitworks.css";

function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create Subject Workspaces",
      description:
        "Organize your courses into clean, dedicated subject hubs. Keep lecture notes, AI conversations, and flashcard decks categorized.",
    },
    {
      number: "2",
      title: "Input Notes & Resource Links",
      description:
        "Add course notes and external documentation. Content syncs to your personal cloud database in real time.",
    },
    {
      number: "3",
      title: "Query AI & Master Concepts",
      description:
        "Ask your AI tutor questions, attempt automated MCQ practice quizzes, and flip 3D active recall flashcards.",
    },
  ];

  return (
    <section className="how-it-works-netflix" id="how-it-works">
      <hr className="netflix-divider" />
      
      <div className="how-container-netflix">
        <h2 className="how-main-title">How StudySphere AI Works</h2>
        <p className="how-sub-title">From static course notes to active mastery in three simple steps.</p>

        <div className="steps-row-netflix">
          {steps.map((step) => (
            <div className="step-card-netflix" key={step.number}>
              <div className="step-badge-num">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;