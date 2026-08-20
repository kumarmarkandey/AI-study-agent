import "./Howitworks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Subject Workspaces",
      description:
        "Organize your courses into structured subject hubs. Keep all notes, materials, AI conversations, and quizzes cleanly categorized.",
    },
    {
      number: "02",
      title: "Input Notes & Reference Links",
      description:
        "Add comprehensive lecture notes and reference materials. Content automatically syncs to your cloud database in real time.",
    },
    {
      number: "03",
      title: "Activate AI Tutor & 3D Flashcards",
      description:
        "Query your AI tutor for instant explanations, attempt automated MCQs, and master definitions using interactive 3D flashcards.",
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-heading">
        <span className="section-tag">STREAMLINED WORKFLOW</span>
        <h2>From Raw Course Material to Active Mastery</h2>
        <p>
          Transform traditional static studying into an interactive, AI-driven learning experience in three simple steps.
        </p>
      </div>

      <div className="steps-container">
        {steps.map((step) => (
          <div className="step-card glass-card-3d" key={step.number}>
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;