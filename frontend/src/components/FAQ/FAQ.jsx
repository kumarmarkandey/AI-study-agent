import { useState } from "react";
import { Plus, X } from "lucide-react";
import "./FAQ.css";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is StudySphere AI?",
      answer:
        "StudySphere AI is an intelligent academic study workspace designed for students and professionals. It allows you to organize static notes into dynamic subject hubs, query a context-aware AI tutor 24/7, practice with 3D flashcards, and test yourself with automated multiple-choice quizzes.",
    },
    {
      question: "How does the AI Tutor answer questions about my notes?",
      answer:
        "When you upload or write lecture notes in a subject workspace, StudySphere AI indexes your materials so the AI tutor can reference your exact formulas, definitions, and course concepts when answering your questions.",
    },
    {
      question: "What are 3D Active Recall Flashcards?",
      answer:
        "3D Flashcards use active recall principles and 3D visual card flips with keyboard navigation. You can flip cards using the Spacebar, mark your confidence score, and filter decks by mastery levels to focus on topics you need to review.",
    },
    {
      question: "Can I generate automated quizzes from my lecture notes?",
      answer:
        "Yes! Simply click 'Generate Quiz' inside any subject workspace, and StudySphere AI will read your notes and generate multiple-choice questions with answer keys, explanations, and instant score tracking.",
    },
    {
      question: "Is StudySphere AI free to use?",
      answer:
        "You can sign up for a free account instantly. All core features including subject workspaces, AI note querying, 3D flashcards, and automated quizzes are accessible right away.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section-netflix">
      <div className="faq-container">
        <h2 className="faq-main-heading">Frequently Asked Questions</h2>

        <div className="faq-accordion-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="faq-item">
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <X size={28} className="faq-icon" /> : <Plus size={28} className="faq-icon" />}
                </button>

                {isOpen && (
                  <div className="faq-answer-panel">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
