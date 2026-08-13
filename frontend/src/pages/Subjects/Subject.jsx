import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Canvas3D from "../../components/3D/Canvas3D";
import AIOrb3D from "../../components/3D/AIOrb3D";
import "./subject.css";

function Subject() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("notes"); // notes | materials | ai-chat | quiz | flashcards

  const [subject, setSubject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [chats, setChats] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [flashcards, setFlashcards] = useState([]);

  // Form States
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const [matTitle, setMatTitle] = useState("");
  const [matUrl, setMatUrl] = useState("");
  const [matSummary, setMatSummary] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [aiThinking, setAiThinking] = useState(false);

  // Active Quiz taking state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // Active Flashcard index & flip
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadSubjectData = async () => {
      try {
        const [subjectRes, notesRes, materialsRes, chatsRes, quizzesRes, flashcardsRes] =
          await Promise.all([
            fetch(`http://localhost:5000/api/subjects/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:5000/api/notes/subject/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:5000/api/materials/subject/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:5000/api/ai/chat/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:5000/api/ai/quizzes/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:5000/api/ai/flashcards/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const sData = await subjectRes.json();
        const nData = await notesRes.json();
        const mData = await materialsRes.json();
        const cData = await chatsRes.json();
        const qData = await quizzesRes.json();
        const fData = await flashcardsRes.json();

        if (!subjectRes.ok) {
          setError(sData.message || "Unable to load subject workspace.");
          return;
        }

        setSubject(sData.subject);
        setNotes(nData.notes || []);
        setMaterials(mData.materials || []);
        setChats(cData.chats || []);
        setQuizzes(qData.quizzes || []);
        setFlashcards(fData.flashcards || []);
      } catch (err) {
        console.error("Load subject workspace error:", err);
        setError("Unable to connect to the backend server.");
      } finally {
        setLoading(false);
      }
    };

    loadSubjectData();
  }, [navigate, subjectId, token]);

  // ---------------- NOTES ACTIONS ----------------
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) {
      setError("Please fill in both title and content for your note.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subjectId, title: noteTitle, content: noteContent }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to create note.");
        return;
      }

      setNotes((prev) => [
        { ...data.note, created_at: new Date().toISOString() },
        ...prev,
      ]);
      setNoteTitle("");
      setNoteContent("");
    } catch (err) {
      console.error("Create note error:", err);
      setError("Unable to save note to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error("Delete note error:", err);
    }
  };

  // ---------------- MATERIAL ACTIONS ----------------
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!matTitle.trim()) {
      setError("Material title is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subjectId,
          title: matTitle,
          file_url: matUrl,
          summary: matSummary,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to add material.");
        return;
      }

      setMaterials((prev) => [data.material, ...prev]);
      setMatTitle("");
      setMatUrl("");
      setMatSummary("");
    } catch (err) {
      console.error("Add material error:", err);
      setError("Unable to save material.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/materials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Delete material error:", err);
    }
  };

  // ---------------- AI CHAT ACTIONS ----------------
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || aiThinking) return;

    const userMsg = chatInput;
    setChatInput("");
    setAiThinking(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subjectId, message: userMsg }),
      });

      const data = await response.json();
      if (response.ok && data.chat) {
        setChats((prev) => [...prev, data.chat]);
      }
    } catch (err) {
      console.error("AI Chat send error:", err);
    } finally {
      setAiThinking(false);
    }
  };

  // ---------------- QUIZ ACTIONS ----------------
  const handleGenerateQuiz = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/ai/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subjectId }),
      });

      const data = await response.json();
      if (response.ok) {
        // Refresh quizzes list
        const qRes = await fetch(`http://localhost:5000/api/ai/quizzes/${subjectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const qData = await qRes.json();
        setQuizzes(qData.quizzes || []);
        if (data.quizId) {
          handleStartQuiz(data.quizId);
        }
      }
    } catch (err) {
      console.error("Generate quiz error:", err);
      setError("Unable to generate quiz.");
    } finally {
      setSaving(false);
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ai/quiz/questions/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.questions) {
        const qObj = quizzes.find((q) => q.id === quizId) || { id: quizId, title: "Quiz" };
        setActiveQuiz(qObj);
        setQuizQuestions(data.questions);
        setQuizAnswers({});
        setQuizResult(null);
      }
    } catch (err) {
      console.error("Start quiz error:", err);
    }
  };

  const handleSubmitQuiz = async () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct_option) {
        score += 1;
      }
    });

    setQuizResult({ score, total: quizQuestions.length });

    try {
      await fetch("http://localhost:5000/api/ai/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          score,
          totalQuestions: quizQuestions.length,
        }),
      });

      // Update quiz list completed score
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === activeQuiz.id
            ? { ...q, score, total_questions: quizQuestions.length, completed: 1 }
            : q
        )
      );
    } catch (err) {
      console.error("Submit quiz score error:", err);
    }
  };

  // ---------------- FLASHCARD ACTIONS ----------------
  const handleGenerateFlashcards = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/ai/flashcards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subjectId }),
      });

      if (response.ok) {
        const fRes = await fetch(`http://localhost:5000/api/ai/flashcards/${subjectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fData = await fRes.json();
        setFlashcards(fData.flashcards || []);
        setCardIndex(0);
        setIsFlipped(false);
      }
    } catch (err) {
      console.error("Generate flashcards error:", err);
      setError("Unable to generate flashcards.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMastery = async (cardId, currentStatus) => {
    try {
      await fetch(`http://localhost:5000/api/ai/flashcards/${cardId}/master`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isMastered: !currentStatus }),
      });

      setFlashcards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, is_mastered: !currentStatus ? 1 : 0 } : c))
      );
    } catch (err) {
      console.error("Toggle mastery error:", err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <AIOrb3D isThinking={true} />
        <p className="loading-text gradient-text">Loading Subject Workspace Node...</p>
      </div>
    );
  }

  return (
    <>
      <Canvas3D variant="default" />
      <main className="subject-workspace-page">
        {/* HEADER BAR */}
        <header className="workspace-header glass-panel">
          <button className="btn-3d-secondary back-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>

          <div className="workspace-info">
            <span className="node-tag">3D STUDY NODE</span>
            <h1 className="workspace-title">{subject?.name}</h1>
            <p className="workspace-desc">{subject?.description || "Interactive study environment."}</p>
          </div>
        </header>

        {error && <div className="dashboard-alert glass-panel">{error}</div>}

        {/* WORKSPACE NAVIGATION TABS */}
        <nav className="workspace-tabs glass-panel">
          <button
            className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            📝 Notes ({notes.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "materials" ? "active" : ""}`}
            onClick={() => setActiveTab("materials")}
          >
            📄 Materials ({materials.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "ai-chat" ? "active" : ""}`}
            onClick={() => setActiveTab("ai-chat")}
          >
            🤖 AI Companion ({chats.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "quiz" ? "active" : ""}`}
            onClick={() => setActiveTab("quiz")}
          >
            🧠 AI Quizzes ({quizzes.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "flashcards" ? "active" : ""}`}
            onClick={() => setActiveTab("flashcards")}
          >
            🎴 3D Flashcards ({flashcards.length})
          </button>
        </nav>

        {/* TAB CONTENT AREAS */}
        <div className="tab-content-area">
          {/* 1. NOTES TAB */}
          {activeTab === "notes" && (
            <section className="tab-pane">
              <div className="pane-grid">
                {/* Note Editor Form */}
                <form className="editor-card glass-card-3d" onSubmit={handleCreateNote}>
                  <h3>Create Study Note</h3>
                  <input
                    type="text"
                    placeholder="Note Title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                  <textarea
                    rows="6"
                    placeholder="Write detailed formulas, key points, concepts..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                  <button type="submit" className="btn-3d-primary" disabled={saving}>
                    {saving ? "Saving..." : "+ Add Note to DB ✨"}
                  </button>
                </form>

                {/* Notes List */}
                <div className="notes-list-container">
                  {notes.length === 0 ? (
                    <div className="empty-pane glass-panel">
                      <div className="pane-icon">📝</div>
                      <p>No notes written for this subject yet. Add your first note using the editor.</p>
                    </div>
                  ) : (
                    <div className="notes-grid">
                      {notes.map((note) => (
                        <div key={note.id} className="note-card glass-card-3d">
                          <div className="note-header">
                            <h4>{note.title}</h4>
                            <button
                              className="delete-icon-btn"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              ✕
                            </button>
                          </div>
                          <p className="note-body">{note.content}</p>
                          <span className="note-date">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 2. MATERIALS TAB */}
          {activeTab === "materials" && (
            <section className="tab-pane">
              <div className="pane-grid">
                <form className="editor-card glass-card-3d" onSubmit={handleAddMaterial}>
                  <h3>Add Reference Material</h3>
                  <input
                    type="text"
                    placeholder="Material Title..."
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="File / Link URL (Optional)"
                    value={matUrl}
                    onChange={(e) => setMatUrl(e.target.value)}
                  />
                  <textarea
                    rows="4"
                    placeholder="Summary or reference excerpts..."
                    value={matSummary}
                    onChange={(e) => setMatSummary(e.target.value)}
                  />
                  <button type="submit" className="btn-3d-primary" disabled={saving}>
                    {saving ? "Saving..." : "+ Add Material ✨"}
                  </button>
                </form>

                <div className="materials-list">
                  {materials.length === 0 ? (
                    <div className="empty-pane glass-panel">
                      <div className="pane-icon">📄</div>
                      <p>No reference materials uploaded yet.</p>
                    </div>
                  ) : (
                    <div className="materials-grid">
                      {materials.map((mat) => (
                        <div key={mat.id} className="material-card glass-card-3d">
                          <div className="mat-header">
                            <h4>{mat.title}</h4>
                            <button
                              className="delete-icon-btn"
                              onClick={() => handleDeleteMaterial(mat.id)}
                            >
                              ✕
                            </button>
                          </div>
                          {mat.file_url && (
                            <a
                              href={mat.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mat-link"
                            >
                              🔗 View Resource Link
                            </a>
                          )}
                          <p className="mat-summary">{mat.summary || "No summary provided."}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 3. AI CHAT TAB */}
          {activeTab === "ai-chat" && (
            <section className="tab-pane ai-chat-pane">
              <div className="ai-companion-sidebar glass-panel">
                <AIOrb3D isThinking={aiThinking} />
                <h3 className="gradient-text">StudySphere AI</h3>
                <p>Analyzing notes for <strong>{subject?.name}</strong>.</p>
              </div>

              <div className="chat-interface glass-card-3d">
                <div className="chat-messages">
                  {chats.length === 0 ? (
                    <div className="chat-welcome">
                      <p>👋 Ask any question regarding formulas, explanations, or concepts in <strong>{subject?.name}</strong>.</p>
                    </div>
                  ) : (
                    chats.map((c) => (
                      <div key={c.id} className="chat-group">
                        <div className="chat-bubble user-bubble">
                          <span className="sender-tag">You</span>
                          <p>{c.message}</p>
                        </div>
                        <div className="chat-bubble ai-bubble">
                          <span className="sender-tag ai">AI Assistant</span>
                          <div className="ai-response-formatted">
                            {c.response.split("\n").map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {aiThinking && (
                    <div className="chat-bubble ai-bubble thinking">
                      <p>🤔 AI is analyzing your study notes and generating explanation...</p>
                    </div>
                  )}
                </div>

                <form className="chat-form" onSubmit={handleSendChatMessage}>
                  <input
                    type="text"
                    placeholder="Ask AI a question about this subject..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="btn-3d-primary" disabled={aiThinking}>
                    Send 🚀
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* 4. AI QUIZZES TAB */}
          {activeTab === "quiz" && (
            <section className="tab-pane">
              <div className="quiz-pane-header glass-panel">
                <div>
                  <h3>AI Quiz Generator</h3>
                  <p>Generate multiple choice tests from your subject notes.</p>
                </div>
                <button className="btn-3d-primary" onClick={handleGenerateQuiz} disabled={saving}>
                  {saving ? "Generating..." : "⚡ Generate New Quiz"}
                </button>
              </div>

              {activeQuiz && quizQuestions.length > 0 ? (
                <div className="active-quiz-container glass-card-3d">
                  <div className="quiz-banner">
                    <h4>{activeQuiz.title}</h4>
                    <button className="btn-3d-secondary" onClick={() => setActiveQuiz(null)}>
                      Close Quiz
                    </button>
                  </div>

                  {quizResult ? (
                    <div className="quiz-result-card">
                      <h3>Quiz Score: {quizResult.score} / {quizResult.total}</h3>
                      <p>
                        {quizResult.score === quizResult.total
                          ? "🎉 Perfect Score! Excellent mastery."
                          : "Great effort! Review your notes and try again."}
                      </p>
                      <button className="btn-3d-primary" onClick={() => setActiveQuiz(null)}>
                        Back to Quizzes List
                      </button>
                    </div>
                  ) : (
                    <div className="questions-list">
                      {quizQuestions.map((q, idx) => (
                        <div key={q.id} className="question-item glass-panel">
                          <p className="q-text">
                            <strong>Q{idx + 1}:</strong> {q.question}
                          </p>
                          <div className="options-grid">
                            {["A", "B", "C", "D"].map((optKey) => {
                              const optVal = q[`option_${optKey.toLowerCase()}`];
                              const isSelected = quizAnswers[q.id] === optKey;
                              return (
                                <button
                                  key={optKey}
                                  type="button"
                                  className={`option-btn ${isSelected ? "selected" : ""}`}
                                  onClick={() =>
                                    setQuizAnswers((prev) => ({ ...prev, [q.id]: optKey }))
                                  }
                                >
                                  <strong>{optKey}.</strong> {optVal}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      <button
                        className="btn-3d-primary submit-quiz-btn"
                        onClick={handleSubmitQuiz}
                      >
                        Submit Quiz Answers ✨
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="quizzes-history-grid">
                  {quizzes.length === 0 ? (
                    <div className="empty-pane glass-panel">
                      <div className="pane-icon">🧠</div>
                      <p>No quizzes generated yet. Click "Generate New Quiz" above.</p>
                    </div>
                  ) : (
                    quizzes.map((q) => (
                      <div key={q.id} className="quiz-history-card glass-card-3d">
                        <h4>{q.title}</h4>
                        <div className="quiz-meta">
                          <span>Status: {q.completed ? "Completed ✅" : "Not Started"}</span>
                          {q.completed ? (
                            <span className="quiz-score">Score: {q.score} / {q.total_questions}</span>
                          ) : null}
                        </div>
                        <button
                          className="btn-3d-secondary"
                          onClick={() => handleStartQuiz(q.id)}
                        >
                          {q.completed ? "Retake Quiz →" : "Start Quiz →"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </section>
          )}

          {/* 5. 3D FLASHCARDS TAB */}
          {activeTab === "flashcards" && (
            <section className="tab-pane">
              <div className="flashcards-pane-header glass-panel">
                <div>
                  <h3>3D Flip Flashcards Deck</h3>
                  <p>Flip 3D cards to active-recall key terminology and concepts.</p>
                </div>
                <button className="btn-3d-primary" onClick={handleGenerateFlashcards} disabled={saving}>
                  {saving ? "Generating..." : "⚡ Generate Flashcards Deck"}
                </button>
              </div>

              {flashcards.length === 0 ? (
                <div className="empty-pane glass-panel">
                  <div className="pane-icon">🎴</div>
                  <p>No flashcards created yet. Click "Generate Flashcards Deck" above.</p>
                </div>
              ) : (
                <div className="flashcard-deck-viewer">
                  <div className="deck-progress">
                    <span>Card {cardIndex + 1} of {flashcards.length}</span>
                    <span className="mastered-count">
                      Mastered: {flashcards.filter((c) => c.is_mastered).length}
                    </span>
                  </div>

                  {/* 3D FLIP CARD */}
                  <div
                    className={`flashcard-3d-container ${isFlipped ? "flipped" : ""}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className="flashcard-flipper">
                      {/* FRONT */}
                      <div className="card-side card-front glass-card-3d">
                        <span className="side-label">QUESTION / PROMPT</span>
                        <p className="card-text">{flashcards[cardIndex].front}</p>
                        <span className="flip-hint">Click card to flip 🔄</span>
                      </div>
                      {/* BACK */}
                      <div className="card-side card-back glass-card-3d">
                        <span className="side-label">ANSWER / EXPLANATION</span>
                        <p className="card-text">{flashcards[cardIndex].back}</p>
                        <span className="flip-hint">Click card to flip back 🔄</span>
                      </div>
                    </div>
                  </div>

                  <div className="deck-controls">
                    <button
                      className="btn-3d-secondary"
                      disabled={cardIndex === 0}
                      onClick={() => {
                        setCardIndex((prev) => Math.max(0, prev - 1));
                        setIsFlipped(false);
                      }}
                    >
                      ← Previous Card
                    </button>

                    <button
                      className={`btn-3d-secondary ${flashcards[cardIndex].is_mastered ? "mastered" : ""}`}
                      onClick={() =>
                        handleToggleMastery(
                          flashcards[cardIndex].id,
                          flashcards[cardIndex].is_mastered
                        )
                      }
                    >
                      {flashcards[cardIndex].is_mastered ? "Mastered ✅" : "Mark as Mastered ⭐"}
                    </button>

                    <button
                      className="btn-3d-secondary"
                      disabled={cardIndex === flashcards.length - 1}
                      onClick={() => {
                        setCardIndex((prev) => Math.min(flashcards.length - 1, prev + 1));
                        setIsFlipped(false);
                      }}
                    >
                      Next Card →
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </>
  );
}

export default Subject;