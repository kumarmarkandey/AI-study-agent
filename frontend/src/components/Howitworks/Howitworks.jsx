import "./Howitworks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your 3D Subject Hub",
      description:
        "Sign up, log in, and organize your subjects into dedicated study nodes.",
    },
    {
      number: "02",
      title: "Add Notes & Study Materials",
      description:
        "Input your notes and reference links to store them securely in your live MySQL database.",
    },
    {
      number: "03",
      title: "Unleash AI & Interactive Tools",
      description:
        "Generate automated AI quizzes, flip 3D flashcards, and chat with your AI assistant.",
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-heading">
        <span className="section-tag">SIMPLE 3-STEP PROCESS</span>
        <h2>From Raw Notes to Mastered Knowledge</h2>
        <p>
          Elevate your study routine into an engaging 3D visual workspace in minutes.
        </p>
      </div>

      <div className="steps-container">
        {steps.map((step) => (
          <div className="step-card glass-card-3d" key={step.number}>
            <div className="step-number gradient-text">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;