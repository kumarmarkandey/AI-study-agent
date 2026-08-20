import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Sparkles,
  Plus,
  LogOut,
  Search,
  Trash2,
  BookOpen,
  FileText,
  Brain,
  Layers,
  X,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Canvas3D from "../components/3D/Canvas3D";
import AIOrb3D from "../components/3D/AIOrb3D";
import { API_BASE_URL } from "../config/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalNotes: 0,
    totalQuizzes: 0,
    avgQuizScore: 0,
    totalFlashcards: 0,
    masteredFlashcards: 0,
  });

  const [subjectName, setSubjectName] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const [userRes, subjectsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/subjects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/ai/progress/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userData = await userRes.json();
        const subjectsData = await subjectsRes.json();
        const statsData = await statsRes.json();

        if (!userRes.ok || !subjectsRes.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setUser(userData.user);
        setSubjects(subjectsData.subjects || []);
        if (statsData.stats) {
          setStats(statsData.stats);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Unable to connect to the backend database server.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, token]);

  // Keyboard shortcut listener for ESC key to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowAddModal(false);
        setSubjectToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCreateSubject = async (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      setError("Please provide a subject title.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: subjectName,
          description: subjectDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create subject.");
        return;
      }

      setSubjects((prev) => [data.subject, ...prev]);
      setStats((prev) => ({ ...prev, totalSubjects: prev.totalSubjects + 1 }));
      setSubjectName("");
      setSubjectDescription("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Create subject error:", err);
      setError("Unable to connect to the backend server.");
    } finally {
      setCreating(false);
    }
  };

  const confirmDeleteSubject = async () => {
    if (!subjectToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/subjects/${subjectToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Unable to delete subject.");
        return;
      }

      setSubjects((prev) => prev.filter((s) => s.id !== subjectToDelete.id));
      setStats((prev) => ({ ...prev, totalSubjects: Math.max(0, prev.totalSubjects - 1) }));
      setSubjectToDelete(null);
    } catch (err) {
      console.error("Delete subject error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <AIOrb3D isThinking={true} />
        <p className="loading-text gradient-text">Initializing 3D Study Companion Workspace...</p>
      </div>
    );
  }

  return (
    <>
      <Canvas3D variant="default" />
      <main className="dashboard-page">
        {/* TOP BAR */}
        <header className="dashboard-header glass-panel">
          <div className="header-brand">
            <Link to="/" className="brand-logo">
              <Box size={20} className="logo-box-icon" />
              <span>StudySphere</span>
              <span className="logo-ai">AI</span>
              <span className="badge-3d-tag">PRO</span>
            </Link>
            <p className="welcome-tag">
              Welcome back, <strong className="user-name">{user?.name || "Student"}</strong>
            </p>
          </div>

          <div className="header-actions">
            <button className="btn-3d-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              <span>New Subject</span>
            </button>
            <button className="btn-3d-secondary logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {error && (
          <div className="dashboard-alert glass-panel">
            <AlertTriangle size={18} className="alert-icon" />
            <span>{error}</span>
            <button className="close-alert" onClick={() => setError("")}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* METRICS STATS BAR */}
        <section className="stats-bar">
          <div className="stat-box glass-card-3d">
            <div className="stat-icon-wrap cyan">
              <BookOpen size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-val gradient-text">{stats.totalSubjects}</span>
              <span className="stat-lbl">Active Subjects</span>
            </div>
          </div>

          <div className="stat-box glass-card-3d">
            <div className="stat-icon-wrap indigo">
              <FileText size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-val gradient-text">{stats.totalNotes}</span>
              <span className="stat-lbl">Study Notes</span>
            </div>
          </div>

          <div className="stat-box glass-card-3d">
            <div className="stat-icon-wrap purple">
              <Brain size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-val gradient-text">{stats.totalQuizzes}</span>
              <span className="stat-lbl">Quizzes Taken</span>
            </div>
          </div>

          <div className="stat-box glass-card-3d">
            <div className="stat-icon-wrap rose">
              <Layers size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-val gradient-text">
                {stats.masteredFlashcards} / {stats.totalFlashcards}
              </span>
              <span className="stat-lbl">Flashcards Mastered</span>
            </div>
          </div>
        </section>

        {/* SUBJECTS SECTION */}
        <section className="subjects-section">
          <div className="section-title-bar">
            <div>
              <h2>3D Subject Nodes</h2>
              <p>Select a subject to enter its dedicated study space with notes, AI chat, & quizzes.</p>
            </div>

            <div className="subject-actions-row">
              {subjects.length > 0 && (
                <div className="search-box-wrapper glass-panel">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="clear-search" onClick={() => setSearchQuery("")}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}

              <button className="btn-3d-primary" onClick={() => setShowAddModal(true)}>
                <Plus size={16} />
                <span>Add Subject</span>
              </button>
            </div>
          </div>

          {subjects.length === 0 ? (
            <div className="empty-subjects-card glass-panel">
              <div className="empty-icon-3d">
                <BookOpen size={48} className="empty-book-icon" />
              </div>
              <h3>No Study Subjects Yet</h3>
              <p>Create your first subject node to start populating your study companion with notes and AI.</p>
              <button className="btn-3d-primary" onClick={() => setShowAddModal(true)}>
                <Sparkles size={16} />
                <span>Create Subject Node</span>
              </button>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="empty-subjects-card glass-panel">
              <h3>No Subjects Found</h3>
              <p>No study subjects match your search query "{searchQuery}".</p>
              <button className="btn-3d-secondary" onClick={() => setSearchQuery("")}>
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="subjects-grid">
              {filteredSubjects.map((subject) => (
                <div
                  className="subject-card glass-card-3d"
                  key={subject.id}
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                >
                  <div className="card-top">
                    <div className="subject-node-icon">
                      <BookOpen size={20} />
                    </div>
                    <button
                      className="delete-subject-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubjectToDelete(subject);
                      }}
                      title="Delete Subject"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="subject-title">{subject.name}</h3>
                  <p className="subject-desc">
                    {subject.description || "Interactive study node ready for notes & AI."}
                  </p>

                  <div className="card-footer">
                    <span className="open-badge">
                      <span>Enter Subject Space</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ADD SUBJECT MODAL */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content glass-card-3d" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create 3D Subject Node</h3>
                <button className="close-modal" onClick={() => setShowAddModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubject} className="modal-form">
                <div className="form-group">
                  <label>Subject Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Organic Chemistry, Quantum Physics"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Chapter 4 to 8 notes & formulas"
                    value={subjectDescription}
                    onChange={(e) => setSubjectDescription(e.target.value)}
                  />
                </div>

                <div className="modal-buttons">
                  <button
                    type="button"
                    className="btn-3d-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-3d-primary" disabled={creating}>
                    {creating ? "Saving Node..." : "Create Subject"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {subjectToDelete && (
          <div className="modal-overlay" onClick={() => setSubjectToDelete(null)}>
            <div className="modal-content glass-card-3d" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="delete-modal-title">
                  <AlertTriangle size={20} className="delete-warn-icon" />
                  <h3>Delete Subject Node</h3>
                </div>
                <button className="close-modal" onClick={() => setSubjectToDelete(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="delete-modal-body">
                <p>
                  Are you sure you want to delete <strong>"{subjectToDelete.name}"</strong>?
                </p>
                <p className="delete-subtext">
                  This will permanently remove all associated notes, reference materials, AI chat history, and quizzes for this subject.
                </p>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-3d-secondary"
                  onClick={() => setSubjectToDelete(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-3d-danger"
                  onClick={confirmDeleteSubject}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Yes, Delete Subject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Dashboard;