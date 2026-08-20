import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  FolderOpen,
  Bot,
  Brain,
  Layers,
  Plus,
  Trash2,
  Search,
  Copy,
  Check,
  Eye,
  X,
  ExternalLink,
  Link2,
  Send,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCw,
  Award,
  ChevronLeft,
  ChevronRight,
  Star,
  BookOpen,
} from "lucide-react";
import Canvas3D from "../../components/3D/Canvas3D";
import AIOrb3D from "../../components/3D/AIOrb3D";
import { API_BASE_URL } from "../../config/api";
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

  // Form & Interaction States
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteSearchQuery, setNoteSearchQuery] = useState("");
  const [viewingNote, setViewingNote] = useState(null);
  const [copiedNoteId, setCopiedNoteId] = useState(null);

  const [matTitle, setMatTitle] = useState("");
  const [matUrl, setMatUrl] = useState("");
  const [matSummary, setMatSummary] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const chatMessagesEndRef = useRef(null);

  // Active Quiz taking state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // Active Flashcard deck state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardFilter, setFlashcardFilter] = useState("all"); // all | needs-review | mastered

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
            fetch(`${API_BASE_URL}/api/subjects/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/api/notes/subject/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/api/materials/subject/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/api/ai/chat/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/api/ai/quizzes/${subjectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/api/ai/flashcards/${subjectId}`, {
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

  // Scroll chat messages to bottom on new message
  useEffect(() => {
    if (activeTab === "ai-chat") {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, aiThinking, activeTab]);

  // Global Keyboard Navigation (ESC to close modals, Arrow keys for Flashcards)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setViewingNote(null);
      }

      if (activeTab === "flashcards" && visibleFlashcards.length > 0) {
        if (e.key === "ArrowRight") {
          setCardIndex((prev) => Math.min(visibleFlashcards.length - 1, prev + 1));
          setIsFlipped(false);
        } else if (e.key === "ArrowLeft") {
          setCardIndex((prev) => Math.max(0, prev - 1));
          setIsFlipped(false);
        } else if (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, flashcardFilter, flashcards]);

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
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
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

  const handleDeleteNote = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        if (viewingNote?.id === id) setViewingNote(null);
      }
    } catch (err) {
      console.error("Delete note error:", err);
    }
  };

  const handleCopyNoteText = (note, e) => {
    if (e) e.stopPropagation();
    const textToCopy = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 1800);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(noteSearchQuery.toLowerCase())
  );

  // ---------------- MATERIAL ACTIONS ----------------
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!matTitle.trim()) {
      setError("Material title is required.");
      return;
    }

    let formattedUrl = matUrl.trim();
    if (formattedUrl && !formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subjectId,
          title: matTitle,
          file_url: formattedUrl,
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
      const response = await fetch(`${API_BASE_URL}/api/materials/${id}`, {
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
  const handleSendChatMessage = async (msgText) => {
    const textToSend = msgText || chatInput;
    if (!textToSend.trim() || aiThinking) return;

    setChatInput("");
    setAiThinking(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subjectId, message: textToSend }),
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
      const response = await fetch(`${API_BASE_URL}/api/ai/quiz/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subjectId }),
      });

      const data = await response.json();
      if (response.ok) {
        const qRes = await fetch(`${API_BASE_URL}/api/ai/quizzes/${subjectId}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/${quizId}`, {
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
      await fetch(`${API_BASE_URL}/api/ai/quiz/submit`, {
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
      const response = await fetch(`${API_BASE_URL}/api/ai/flashcards/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subjectId }),
      });

      if (response.ok) {
        const fRes = await fetch(`${API_BASE_URL}/api/ai/flashcards/${subjectId}`, {
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
      await fetch(`${API_BASE_URL}/api/ai/flashcards/${cardId}/master`, {
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

  const visibleFlashcards = flashcards.filter((c) => {
    if (flashcardFilter === "mastered") return c.is_mastered;
    if (flashcardFilter === "needs-review") return !c.is_mastered;
    return true;
  });

  const currentFlashcard = visibleFlashcards[cardIndex] || visibleFlashcards[0];

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
            <ArrowLeft size={16} />
            <span>Back to Workspace</span>
          </button>

          <div className="workspace-info">
            <span className="node-tag">
              <Sparkles size={11} /> 3D STUDY NODE
            </span>
            <h1 className="workspace-title">{subject?.name}</h1>
            <p className="workspace-desc">{subject?.description || "Interactive study space."}</p>
          </div>
        </header>

        {error && (
          <div className="dashboard-alert glass-panel">
            <span>{error}</span>
            <button className="close-alert" onClick={() => setError("")}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* WORKSPACE NAVIGATION TABS */}
        <nav className="workspace-tabs glass-panel">
          <button
            className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            <FileText size={16} />
            <span>Notes ({notes.length})</span>
          </button>

          <button
            className={`tab-btn ${activeTab === "materials" ? "active" : ""}`}
            onClick={() => setActiveTab("materials")}
          >
            <FolderOpen size={16} />
            <span>Materials ({materials.length})</span>
          </button>

          <button
            className={`tab-btn ${activeTab === "ai-chat" ? "active" : ""}`}
            onClick={() => setActiveTab("ai-chat")}
          >
            <Bot size={16} />
            <span>AI Companion ({chats.length})</span>
          </button>

          <button
            className={`tab-btn ${activeTab === "quiz" ? "active" : ""}`}
            onClick={() => setActiveTab("quiz")}
          >
            <Brain size={16} />
            <span>AI Quizzes ({quizzes.length})</span>
          </button>

          <button
            className={`tab-btn ${activeTab === "flashcards" ? "active" : ""}`}
            onClick={() => setActiveTab("flashcards")}
          >
            <Layers size={16} />
            <span>3D Flashcards ({flashcards.length})</span>
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
                  <div className="editor-card-header">
                    <FileText size={18} className="form-head-icon" />
                    <h3>Create Study Note</h3>
                  </div>

                  <input
                    type="text"
                    placeholder="Note Title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />

                  <textarea
                    rows="7"
                    placeholder="Write detailed formulas, key points, concepts..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />

                  <button type="submit" className="btn-3d-primary" disabled={saving}>
                    <Plus size={16} />
                    <span>{saving ? "Saving..." : "Add Note to DB"}</span>
                  </button>
                </form>

                {/* Notes List with Live Search */}
                <div className="notes-list-container">
                  {notes.length > 0 && (
                    <div className="notes-search-bar glass-panel">
                      <Search size={16} className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search notes in this subject..."
                        value={noteSearchQuery}
                        onChange={(e) => setNoteSearchQuery(e.target.value)}
                      />
                      {noteSearchQuery && (
                        <button className="clear-search" onClick={() => setNoteSearchQuery("")}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  {notes.length === 0 ? (
                    <div className="empty-pane glass-panel">
                      <FileText size={40} className="empty-pane-icon" />
                      <p>No notes written for this subject yet. Add your first note using the editor.</p>
                    </div>
                  ) : filteredNotes.length === 0 ? (
                    <div className="empty-pane glass-panel">
                      <p>No notes found matching "{noteSearchQuery}".</p>
                      <button className="btn-3d-secondary" onClick={() => setNoteSearchQuery("")}>
                        Clear Search Filter
                      </button>
                    </div>
                  ) : (
                    <div className="notes-grid">
                      {filteredNotes.map((note) => (
                        <div
                          key={note.id}
                          className="note-card glass-card-3d"
                          onClick={() => setViewingNote(note)}
                        >
                          <div className="note-header">
                            <h4>{note.title}</h4>
                            <div className="note-actions-row">
                              <button
                                className="copy-icon-btn"
                                onClick={(e) => handleCopyNoteText(note, e)}
                                title="Copy Note Content"
                              >
                                {copiedNoteId === note.id ? (
                                  <Check size={14} className="copied-check" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>

                              <button
                                className="delete-icon-btn"
                                onClick={(e) => handleDeleteNote(note.id, e)}
                                title="Delete Note"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <p className="note-body">
                            {note.content.length > 180
                              ? `${note.content.substring(0, 180)}...`
                              : note.content}
                          </p>

                          <div className="note-footer">
                            <span className="note-date">
                              {new Date(note.created_at).toLocaleDateString()}
                            </span>
                            <span className="read-note-badge">
                              <Eye size={12} /> Read Full Note
                            </span>
                          </div>
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
                  <div className="editor-card-header">
                    <FolderOpen size={18} className="form-head-icon" />
                    <h3>Add Reference Material</h3>
                  </div>

                  <input
                    type="text"
                    placeholder="Material Title (e.g. Chapter 3 Slides)..."
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Resource URL (e.g. https://drive.google.com/...)"
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
                    <Plus size={16} />
                    <span>{saving ? "Saving..." : "Add Material"}</span>
                  </button>
                </form>

                <div className="materials-list">
                  {materials.length === 0 ? (
                    <div className="empty-pane glass-panel">
                      <FolderOpen size={40} className="empty-pane-icon" />
                      <p>No reference materials uploaded yet. Save links & docs above.</p>
                    </div>
                  ) : (
                    <div className="materials-grid">
                      {materials.map((mat) => (
                        <div key={mat.id} className="material-card glass-card-3d">
                          <div className="mat-header">
                            <div className="mat-title-icon">
                              <Link2 size={16} className="mat-link-icon" />
                              <h4>{mat.title}</h4>
                            </div>

                            <button
                              className="delete-icon-btn"
                              onClick={() => handleDeleteMaterial(mat.id)}
                              title="Delete Material"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {mat.file_url && (
                            <a
                              href={mat.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mat-link"
                            >
                              <ExternalLink size={14} />
                              <span>View External Resource Link</span>
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
                <p>
                  Analyzing notes for <strong>{subject?.name}</strong>.
                </p>

                <div className="prompt-suggestions">
                  <span className="suggestions-head">
                    <Lightbulb size={13} /> Quick Prompts:
                  </span>
                  <button
                    className="prompt-chip"
                    onClick={() => handleSendChatMessage("Summarize all notes in this subject.")}
                  >
                    "Summarize key notes"
                  </button>
                  <button
                    className="prompt-chip"
                    onClick={() => handleSendChatMessage("What are the most important formulas/definitions?")}
                  >
                    "Key formulas & definitions"
                  </button>
                  <button
                    className="prompt-chip"
                    onClick={() => handleSendChatMessage("Explain difficult concepts in simple terms.")}
                  >
                    "Explain concepts simply"
                  </button>
                </div>
              </div>

              <div className="chat-interface glass-card-3d">
                <div className="chat-messages">
                  {chats.length === 0 ? (
                    <div className="chat-welcome">
                      <Bot size={36} className="welcome-ai-icon" />
                      <h4>Ask StudySphere AI Anything</h4>
                      <p>
                        I can analyze your uploaded study notes for <strong>{subject?.name}</strong> and answer questions, create practice problems, or explain complex ideas.
                      </p>
                    </div>
                  ) : (
                    chats.map((c) => (
                      <div key={c.id} className="chat-group">
                        <div className="chat-bubble user-bubble">
                          <span className="sender-tag">You</span>
                          <p>{c.message}</p>
                        </div>

                        <div className="chat-bubble ai-bubble">
                          <span className="sender-tag ai">
                            <Sparkles size={11} /> AI Assistant
                          </span>
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

                  <div ref={chatMessagesEndRef} />
                </div>

                <form
                  className="chat-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Ask AI a question about this subject..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="btn-3d-primary" disabled={aiThinking}>
                    <Send size={16} />
                    <span>Send</span>
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
                  <p>Generate multiple choice tests automatically from your notes.</p>
                </div>

                <button className="btn-3d-primary" onClick={handleGenerateQuiz} disabled={saving}>
                  <Sparkles size={16} />
                  <span>{saving ? "Generating..." : "Generate New Quiz"}</span>
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
                      <Award size={48} className="result-award-icon" />
                      <h3>
                        Quiz Score: {quizResult.score} / {quizResult.total}
                      </h3>
                      <p className="result-percent">
                        {Math.round((quizResult.score / quizResult.total) * 100)}% Mastery Score
                      </p>
                      <p className="result-feedback">
                        {quizResult.score === quizResult.total
                          ? "🎉 Perfect Score! Outstanding understanding of subject material."
                          : quizResult.score >= quizResult.total / 2
                          ? "Good effort! Review missed questions below."
                          : "Needs Review! Re-read your notes and try again."}
                      </p>

                      <div className="quiz-review-breakdown">
                        <h4>Answer Breakdown:</h4>
                        {quizQuestions.map((q, idx) => {
                          const userAns = quizAnswers[q.id];
                          const isCorrect = userAns === q.correct_option;
                          return (
                            <div
                              key={q.id}
                              className={`review-item ${isCorrect ? "correct" : "incorrect"}`}
                            >
                              <div className="review-item-hdr">
                                {isCorrect ? (
                                  <CheckCircle2 size={16} className="pass-icon" />
                                ) : (
                                  <XCircle size={16} className="fail-icon" />
                                )}
                                <span>
                                  Q{idx + 1}: {q.question}
                                </span>
                              </div>
                              <p className="review-answer">
                                Your choice: <strong>{userAns || "None"}</strong> | Correct answer:{" "}
                                <strong>{q.correct_option}</strong>
                              </p>
                            </div>
                          );
                        })}
                      </div>

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

                      <button className="btn-3d-primary submit-quiz-btn" onClick={handleSubmitQuiz}>
                        <CheckCircle2 size={18} />
                        <span>Submit Quiz Answers</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="quizzes-history-grid">
                  {quizzes.length === 0 ? (
                    <div className="empty-pane glass-panel">
                      <Brain size={40} className="empty-pane-icon" />
                      <p>No quizzes generated yet. Click "Generate New Quiz" above.</p>
                    </div>
                  ) : (
                    quizzes.map((q) => (
                      <div key={q.id} className="quiz-history-card glass-card-3d">
                        <h4>{q.title}</h4>
                        <div className="quiz-meta">
                          <span>Status: {q.completed ? "Completed ✅" : "Not Started"}</span>
                          {q.completed ? (
                            <span className="quiz-score">
                              Score: {q.score} / {q.total_questions}
                            </span>
                          ) : null}
                        </div>
                        <button className="btn-3d-secondary" onClick={() => handleStartQuiz(q.id)}>
                          <RotateCw size={14} />
                          <span>{q.completed ? "Retake Quiz" : "Start Quiz"}</span>
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

                <div className="flashcard-actions">
                  <div className="deck-filter-tabs">
                    <button
                      className={`filter-btn ${flashcardFilter === "all" ? "active" : ""}`}
                      onClick={() => {
                        setFlashcardFilter("all");
                        setCardIndex(0);
                        setIsFlipped(false);
                      }}
                    >
                      All ({flashcards.length})
                    </button>
                    <button
                      className={`filter-btn ${flashcardFilter === "needs-review" ? "active" : ""}`}
                      onClick={() => {
                        setFlashcardFilter("needs-review");
                        setCardIndex(0);
                        setIsFlipped(false);
                      }}
                    >
                      Needs Review ({flashcards.filter((c) => !c.is_mastered).length})
                    </button>
                    <button
                      className={`filter-btn ${flashcardFilter === "mastered" ? "active" : ""}`}
                      onClick={() => {
                        setFlashcardFilter("mastered");
                        setCardIndex(0);
                        setIsFlipped(false);
                      }}
                    >
                      Mastered ({flashcards.filter((c) => c.is_mastered).length})
                    </button>
                  </div>

                  <button className="btn-3d-primary" onClick={handleGenerateFlashcards} disabled={saving}>
                    <Sparkles size={16} />
                    <span>{saving ? "Generating..." : "Generate Deck"}</span>
                  </button>
                </div>
              </div>

              {flashcards.length === 0 ? (
                <div className="empty-pane glass-panel">
                  <Layers size={40} className="empty-pane-icon" />
                  <p>No flashcards created yet. Click "Generate Deck" above.</p>
                </div>
              ) : visibleFlashcards.length === 0 ? (
                <div className="empty-pane glass-panel">
                  <p>No flashcards match the selected filter category.</p>
                  <button
                    className="btn-3d-secondary"
                    onClick={() => {
                      setFlashcardFilter("all");
                      setCardIndex(0);
                    }}
                  >
                    Show All Flashcards
                  </button>
                </div>
              ) : (
                <div className="flashcard-deck-viewer">
                  <div className="deck-progress">
                    <span>
                      Card {cardIndex + 1} of {visibleFlashcards.length}
                    </span>

                    <span className="keyboard-hint-badge">
                      Tip: Use Arrow Keys ← → to navigate & Spacebar to flip
                    </span>

                    <span className="mastered-count">
                      <Star size={14} className="star-icon" />
                      <span>
                        Mastered: {flashcards.filter((c) => c.is_mastered).length} / {flashcards.length}
                      </span>
                    </span>
                  </div>

                  {/* 3D FLIP CARD */}
                  {currentFlashcard && (
                    <div
                      className={`flashcard-3d-container ${isFlipped ? "flipped" : ""}`}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <div className="flashcard-flipper">
                        {/* FRONT */}
                        <div className="card-side card-front glass-card-3d">
                          <span className="side-label">QUESTION / PROMPT</span>
                          <p className="card-text">{currentFlashcard.front}</p>
                          <span className="flip-hint">
                            <RotateCw size={14} /> Click or press Spacebar to flip
                          </span>
                        </div>

                        {/* BACK */}
                        <div className="card-side card-back glass-card-3d">
                          <span className="side-label">ANSWER / EXPLANATION</span>
                          <p className="card-text">{currentFlashcard.back}</p>
                          <span className="flip-hint">
                            <RotateCw size={14} /> Click to flip back
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="deck-controls">
                    <button
                      className="btn-3d-secondary"
                      disabled={cardIndex === 0}
                      onClick={() => {
                        setCardIndex((prev) => Math.max(0, prev - 1));
                        setIsFlipped(false);
                      }}
                    >
                      <ChevronLeft size={18} />
                      <span>Previous Card</span>
                    </button>

                    {currentFlashcard && (
                      <button
                        className={`btn-3d-secondary ${
                          currentFlashcard.is_mastered ? "mastered" : ""
                        }`}
                        onClick={() =>
                          handleToggleMastery(currentFlashcard.id, currentFlashcard.is_mastered)
                        }
                      >
                        <Star size={16} />
                        <span>
                          {currentFlashcard.is_mastered ? "Mastered" : "Mark as Mastered"}
                        </span>
                      </button>
                    )}

                    <button
                      className="btn-3d-secondary"
                      disabled={cardIndex === visibleFlashcards.length - 1}
                      onClick={() => {
                        setCardIndex((prev) => Math.min(visibleFlashcards.length - 1, prev + 1));
                        setIsFlipped(false);
                      }}
                    >
                      <span>Next Card</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* FULL NOTE READER MODAL */}
        {viewingNote && (
          <div className="modal-overlay" onClick={() => setViewingNote(null)}>
            <div className="modal-content glass-card-3d note-reader-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="note-modal-title">
                  <BookOpen size={20} className="form-head-icon" />
                  <h3>{viewingNote.title}</h3>
                </div>

                <div className="note-modal-actions">
                  <button
                    className="copy-icon-btn"
                    onClick={(e) => handleCopyNoteText(viewingNote, e)}
                    title="Copy Note Text"
                  >
                    {copiedNoteId === viewingNote.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>

                  <button className="close-modal" onClick={() => setViewingNote(null)}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="note-modal-body">
                <p className="note-full-text">{viewingNote.content}</p>
                <div className="note-modal-footer">
                  <span>Created: {new Date(viewingNote.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-3d-danger"
                  onClick={() => handleDeleteNote(viewingNote.id)}
                >
                  <Trash2 size={16} />
                  <span>Delete Note</span>
                </button>

                <button
                  type="button"
                  className="btn-3d-secondary"
                  onClick={() => setViewingNote(null)}
                >
                  Close Reader
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Subject;