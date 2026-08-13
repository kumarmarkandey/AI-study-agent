import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Canvas3D from "../components/3D/Canvas3D";
import AIOrb3D from "../components/3D/AIOrb3D";
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

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
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
          fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/subjects", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/ai/progress/stats", {
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

  const handleCreateSubject = async (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      setError("Please provide a subject title.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/subjects", {
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

  const handleDeleteSubject = async (subjectId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this subject and all its content?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/subjects/${subjectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Unable to delete subject.");
        return;
      }

      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
      setStats((prev) => ({ ...prev, totalSubjects: Math.max(0, prev.totalSubjects - 1) }));
    } catch (err) {
      console.error("Delete subject error:", err);
      setError("Unable to connect to the server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
              StudySphere<span className="logo-ai">AI</span> <span>3D</span>
            </Link>
            <p className="welcome-tag">
              Welcome back, <strong className="user-name">{user?.name || "Student"}</strong> 👋
            </p>
          </div>

          <div className="header-actions">
            <button className="btn-3d-primary" onClick={() => setShowAddModal(true)}>
              + New Subject
            </button>
            <button className="btn-3d-secondary logout-btn" onClick={handleLogout}>
              Logout 🚪
            </button>
          </div>
        </header>

        {error && <div className="dashboard-alert glass-panel">{error}</div>}

        {/* METRICS STATS BAR */}
        <section className="stats-bar">
          <div className="stat-box glass-card-3d">
            <div className="stat-icon">📚</div>
            <div className="stat-details">
              <span className="stat-val gradient-text">{stats.totalSubjects}</span>
              <span className="stat-lbl">Active Subjects</span>
            </div>
          </div>

          <div className="stat-box glass-card-3d">
            <div className="stat-icon">📝</div>
            <div className="stat-details">
              <span className="stat-val gradient-text">{stats.totalNotes}</span>
              <span className="stat-lbl">Study Notes</span>
            </div>
          </div>

          <div className="stat-box glass-card-3d">
            <div className="stat-icon">🧠</div>
            <div className="stat-details">
              <span className="stat-val gradient-text">{stats.totalQuizzes}</span>
              <span className="stat-lbl">Quizzes Taken</span>
            </div>
          </div>

          <div className="stat-box glass-card-3d">
            <div className="stat-icon">🎴</div>
            <div className="stat-details">
              <span className="stat-val gradient-text">{stats.masteredFlashcards} / {stats.totalFlashcards}</span>
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
            <button className="btn-3d-secondary" onClick={() => setShowAddModal(true)}>
              + Add Subject
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="empty-subjects-card glass-panel">
              <div className="empty-icon-3d">📚</div>
              <h3>No Study Subjects Yet</h3>
              <p>Create your first subject node to start populating your study companion with notes and AI.</p>
              <button className="btn-3d-primary" onClick={() => setShowAddModal(true)}>
                Create Subject Node ✨
              </button>
            </div>
          ) : (
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <div
                  className="subject-card glass-card-3d"
                  key={subject.id}
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                >
                  <div className="card-top">
                    <div className="subject-node-icon">📚</div>
                    <button
                      className="delete-subject-btn"
                      onClick={(e) => handleDeleteSubject(subject.id, e)}
                      title="Delete Subject"
                    >
                      ✕
                    </button>
                  </div>

                  <h3 className="subject-title">{subject.name}</h3>
                  <p className="subject-desc">
                    {subject.description || "Interactive study node ready for notes & AI."}
                  </p>

                  <div className="card-footer">
                    <span className="open-badge">Enter Subject Space →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ADD SUBJECT MODAL */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content glass-card-3d">
              <div className="modal-header">
                <h3>Create 3D Subject Node</h3>
                <button className="close-modal" onClick={() => setShowAddModal(false)}>✕</button>
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
                  <button type="button" className="btn-3d-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-3d-primary" disabled={creating}>
                    {creating ? "Saving Node..." : "Create Subject ✨"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Dashboard;