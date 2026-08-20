import React from 'react';
import { 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Award, 
  Sparkles, 
  Play, 
  Brain, 
  CheckCircle2,
  TrendingUp,
  Target
} from 'lucide-react';
import { ActivityChart } from './ActivityChart';

export function AnalyticsOverview({ decks, notes, quizzes, results, setActiveTab }) {
  // Compute analytics
  let totalCards = 0;
  let dueTodayCount = 0;
  let masteredCount = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  decks.forEach(d => {
    d.cards.forEach(c => {
      totalCards++;
      if (c.mastered) masteredCount++;
      if (c.dueDate <= todayStr && !c.mastered) dueTodayCount++;
    });
  });

  const totalNotes = notes.length;
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;
  const lastScore = results.length > 0 ? results[0].score : 85;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* AI Daily Briefing Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(56, 189, 248, 0.12) 50%, rgba(168, 85, 247, 0.12) 100%)',
        borderColor: 'rgba(56, 189, 248, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 2, position: 'relative' }}>
          <div>
            <div className="badge badge-cyan" style={{ marginBottom: '14px', padding: '6px 14px' }}>
              <Sparkles size={13} />
              <span>AI Cognitive Recommendation</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px', color: 'white', lineHeight: 1.3 }}>
              Welcome back! You have <span className="gradient-text-cyan">{dueTodayCount} flashcards</span> due for SRS review today.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', maxWidth: '680px', lineHeight: 1.6 }}>
              Retention algorithm suggests focusing on <strong>Deep Learning & Neural Networks</strong>. Your last practice quiz showed strong accuracy in SVMs, but backpropagation math needs 1 quick review session.
            </p>

            <div style={{ display: 'flex', gap: '14px', marginTop: '22px', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveTab('flashcards')} className="btn-primary">
                <Play size={16} />
                <span>Start Review ({dueTodayCount} Due)</span>
              </button>
              <button onClick={() => setActiveTab('tutor')} className="btn-violet">
                <Brain size={16} />
                <span>Ask Socratic Tutor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metric-grid-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '18px'
      }}>
        {/* Metric 1 */}
        <div className="glass-panel glass-card-interactive" onClick={() => setActiveTab('flashcards')} style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Due SRS Cards</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>{dueTodayCount}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginTop: '6px', fontWeight: 500 }}>
            {totalCards} Total Cards across {decks.length} decks
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel glass-card-interactive" onClick={() => setActiveTab('notes')} style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Smart Notes</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--accent-violet)' }}>
              <BookOpen size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>{totalNotes}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-violet)', marginTop: '6px', fontWeight: 500 }}>
            Markdown + KaTeX LaTeX Math
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel glass-card-interactive" onClick={() => setActiveTab('quizzes')} style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Quiz Accuracy</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <HelpCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>{lastScore}%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '6px', fontWeight: 500 }}>
            Based on recent diagnostic quiz
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel glass-card-interactive" onClick={() => setActiveTab('mindmap')} style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Mastery Rate</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
              <Award size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>{masteryPercentage}%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', marginTop: '6px', fontWeight: 500 }}>
            {masteredCount} cards permanently memorized
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Subject Mastery */}
      <div className="dashboard-main-grid" style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px'
      }}>
        {/* Left Column: Weekly Chart */}
        <ActivityChart />

        {/* Right Column: Subject Breakdown */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Target size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Subject Mastery Breakdown</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '8px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Computer Science (AI/ML)</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>78%</span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '8px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Physics (Quantum Mechanics)</span>
                  <span style={{ color: 'var(--accent-violet)' }}>62%</span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg, #a855f7, #c084fc)', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '8px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Biology (Cellular Bio)</span>
                  <span style={{ color: 'var(--accent-emerald)' }}>88%</span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '88%', height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={18} color="var(--accent-emerald)" />
              <span>Next target: Complete Physics Carnot Problem Set</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
