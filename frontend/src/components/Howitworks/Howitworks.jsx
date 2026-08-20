import "./Howitworks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Subject Workspaces",
      description:
        "Organize your courses and study units into dedicated workspace hubs.",
    },
    {
      number: "02",
      title: "Upload Notes & Resources",
      description:
        "Add key notes and reference materials with instant cloud database sync.",
    },
    {
      number: "03",
      title: "Activate AI Assistant & Flashcards",
      description:
        "Generate automated AI quizzes, practice 3D flashcards, and chat with AI in real time.",
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-heading">
        <span className="section-tag">STREAMLINED WORKFLOW</span>
        <h2>From Course Material to Active Mastery</h2>
        <p>
          Transform your traditional study routine into an interactive intelligent workspace in 3 steps.
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