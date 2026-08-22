import React, { useState } from 'react';
import { 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Award, 
  Sparkles, 
  Play, 
  Brain, 
  CheckCircle2,
  Target,
  ArrowUpRight,
  Zap,
  Volume2,
  Clock,
  CheckSquare,
  Network
} from 'lucide-react';
import { ActivityChart } from './ActivityChart';

export function AnalyticsOverview({ decks, notes, quizzes, results, setActiveTab }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');

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

  // Clunk Style Portfolio Showcase Modules
  const showcaseModules = [
    {
      id: 'flashcards',
      category: 'FLASHCARDS',
      title: 'SUPERMEMO SM-2 FLASHCARDS',
      subtitle: 'Spaced Repetition · Active Recall · AI Deck Generation',
      badge: '★ FEATURED MODULE',
      bgGradient: 'linear-gradient(135deg, #181028 0%, #2e1065 100%)',
      icon: Layers,
      description: `Active review session ready with ${dueTodayCount} cards due today.`
    },
    {
      id: 'tutor',
      category: 'TUTOR',
      title: 'SOCRATIC AI ACADEMIC TUTOR',
      subtitle: 'Socratic Dialogue · Multi-Persona · Instant Decks',
      badge: '★ FEATURED MODULE',
      bgGradient: 'linear-gradient(135deg, #091e3a 0%, #102a45 100%)',
      icon: Brain,
      description: 'Engage in deep conceptual dialogues and generate instant flashcards.'
    },
    {
      id: 'quizzes',
      category: 'QUIZZES',
      title: 'ADAPTIVE AI PRACTICE QUIZZES',
      subtitle: 'Diagnostic Testing · Instant Explanations · Score Analytics',
      badge: '★ HIGH ACCURACY',
      bgGradient: 'linear-gradient(135deg, #062e1e 0%, #0d4a32 100%)',
      icon: HelpCircle,
      description: `Your current diagnostic accuracy stands strong at ${lastScore}%.`
    },
    {
      id: 'focus',
      category: 'FOCUS',
      title: 'SOUNDSCAPE POMODORO SYNTH',
      subtitle: 'Binaural Beats · Rain Audio Synth · Deep Work Timer',
      badge: '★ AUDIO SYNTH',
      bgGradient: 'linear-gradient(135deg, #2b1020 0%, #4a1532 100%)',
      icon: Volume2,
      description: 'Web Audio Synth engine with real-time soundscape equalizer.'
    },
    {
      id: 'mindmap',
      category: 'MIND MAP',
      title: 'NEURAL KNOWLEDGE MAP',
      subtitle: 'Interactive Canvas · Spatial Memory · Deck & Note Nodes',
      badge: '★ KNOWLEDGE GRAPH',
      bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      icon: Network,
      description: 'Visualize connections between study notes and flashcard topics.'
    },
    {
      id: 'notes',
      category: 'NOTES',
      title: 'SMART MARKDOWN & LATEX NOTES',
      subtitle: 'LaTeX KaTeX · AI Summarizer · One-Click AI Conversion',
      badge: '★ AI EDITOR',
      bgGradient: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
      icon: BookOpen,
      description: `${totalNotes} smart study notes saved in local workspace.`
    },
    {
      id: 'planner',
      category: 'PLANNER',
      title: 'KANBAN STUDY TASK PLANNER',
      subtitle: 'Task Drag-and-Drop · Priority Tags · Progress Columns',
      badge: '★ FLOW PLANNER',
      bgGradient: 'linear-gradient(135deg, #172554 0%, #1e3a8a 100%)',
      icon: CheckSquare,
      description: 'Organize study sessions, assignments, and exam deadlines.'
    }
  ];

  const filteredShowcase = showcaseModules.filter(item => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      
      {/* 1. CLUNK HERO SECTION */}
      <section 
        style={{
          position: 'relative',
          padding: '48px 0 24px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Badge Tag */}
        <div style={{ marginBottom: '24px' }}>
          <span className="badge badge-grape" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>
            ★ CLUNK DESIGN AGENCY × OMNISTUDY 2.0
          </span>
        </div>

        {/* Massive Headline */}
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: 'clamp(2.8rem, 7vw, 6rem)', 
          fontWeight: 900, 
          letterSpacing: '-0.03em', 
          lineHeight: 0.92,
          textTransform: 'uppercase',
          maxWidth: '1200px',
          marginBottom: '24px',
          color: '#ffffff'
        }}>
          Ditch Average Studying.<br />
          <span style={{ color: 'var(--color-grape-light)' }}>Build The Brain</span> People Don’t Forget.
        </h1>

        {/* Subtitle */}
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', 
          maxWidth: '780px', 
          lineHeight: 1.6,
          marginBottom: '36px'
        }}>
          Creating the next era of AI Cognitive Learning Systems. Spaced repetition flashcards, Socratic voice tutor, diagnostic practice quizzes, binaural soundscapes & neural mind maps.
        </p>

        {/* Call to action buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={() => setActiveTab('flashcards')} 
            className="btn-liquid clunk-shimmer"
            style={{ padding: '14px 32px', fontSize: '0.9rem' }}
          >
            <span>START STUDYING NOW ({dueTodayCount} DUE) ↗</span>
            <span className="clunk-shimmer-sweep" />
          </button>

          <button 
            onClick={() => setActiveTab('tutor')} 
            className="btn-secondary"
            style={{ padding: '14px 28px', fontSize: '0.85rem' }}
          >
            ASK SOCRATIC TUTOR ↗
          </button>
        </div>

        {/* 3D Perspective Tilt Showcase Frame (Clunk Video Showcase Style) */}
        <div 
          style={{ 
            perspective: '1200px', 
            width: '100%', 
            maxWidth: '1200px', 
            marginTop: '56px' 
          }}
        >
          <div 
            style={{
              transform: 'rotateX(14deg)',
              background: 'linear-gradient(145deg, #0d0d12, #181824)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '24px',
              padding: '20px',
              boxShadow: '0 40px 100px -20px rgba(0,0,0,0.9), 0 0 40px var(--color-grape-glow)',
              transition: 'transform 0.5s ease',
              overflow: 'hidden'
            }}
          >
            {/* Interactive Mock Dashboard Bar */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              paddingBottom: '16px', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ marginLeft: '12px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  clunk-study-os-v2.0.live
                </span>
              </div>

              <div className="badge badge-emerald">LIVE AGENT ENGINE</div>
            </div>

            {/* Showcase Visual Canvas */}
            <div style={{
              background: '#050508',
              borderRadius: '16px',
              padding: '36px 28px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              textAlign: 'left'
            }}>
              {/* Feature Box 1 */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '24px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-grape">SUPERMEMO SM-2</span>
                  <Layers size={18} color="var(--color-grape-light)" />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Spaced Repetition
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Algorithm calculates exact recall intervals for optimal memory consolidation.
                </p>
              </div>

              {/* Feature Box 2 */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '24px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-cyan">SOCRATIC AI</span>
                  <Brain size={18} color="var(--accent-cyan)" />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Voice & Chat Tutor
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Ask complex questions, receive guided Socratic hints & export instant decks.
                </p>
              </div>

              {/* Feature Box 3 */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '24px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-emerald">AUDIO SYNTH</span>
                  <Volume2 size={18} color="var(--accent-emerald)" />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Binaural Soundscapes
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Web Audio Synthesizer generates alpha waves, rain, and white noise for deep focus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE MARQUEE TICKER TAPE (Clunk Style) */}
      <div className="clunk-ticker-container">
        <div className="clunk-ticker-x">
          <div className="clunk-ticker-item">
            <span>SUPERMEMO SM-2 FLASHCARDS</span> <span className="star">★</span>
            <span>SOCRATIC AI TUTOR</span> <span className="star">★</span>
            <span>SOUNDSCAPE POMODORO</span> <span className="star">★</span>
            <span>KANBAN PLANNER</span> <span className="star">★</span>
            <span>NEURAL MIND MAPS</span> <span className="star">★</span>
            <span>ADAPTIVE PRACTICE QUIZZES</span> <span className="star">★</span>
            <span>98.4% RETENTION RATE</span> <span className="star">★</span>
          </div>
          <div className="clunk-ticker-item">
            <span>SUPERMEMO SM-2 FLASHCARDS</span> <span className="star">★</span>
            <span>SOCRATIC AI TUTOR</span> <span className="star">★</span>
            <span>SOUNDSCAPE POMODORO</span> <span className="star">★</span>
            <span>KANBAN PLANNER</span> <span className="star">★</span>
            <span>NEURAL MIND MAPS</span> <span className="star">★</span>
            <span>ADAPTIVE PRACTICE QUIZZES</span> <span className="star">★</span>
            <span>98.4% RETENTION RATE</span> <span className="star">★</span>
          </div>
        </div>
      </div>

      {/* 3. FEATURE PORTFOLIO SHOWCASE GRID (Clunk Client Work Style) */}
      <section style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
              OUR STUDY ENGINE & CAPABILITIES
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: '8px' }}>
              OUR RECENT, <br /><span style={{ color: 'var(--color-grape-light)' }}>STUDY MODULES.</span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {['ALL', 'FLASHCARDS', 'QUIZZES', 'TUTOR', 'FOCUS', 'MIND MAP', 'NOTES', 'PLANNER'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: selectedCategory === cat ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.18)',
                  background: selectedCategory === cat ? '#ffffff' : 'transparent',
                  color: selectedCategory === cat ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '32px'
        }}>
          {filteredShowcase.map(module => {
            const Icon = module.icon;

            return (
              <div 
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className="clunk-card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              >
                {/* Image/Gradient Frame */}
                <div 
                  style={{
                    height: '200px',
                    background: module.bgGradient,
                    position: 'relative',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-white">{module.badge}</span>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color="#ffffff" />
                    </div>
                  </div>

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    opacity: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.3s ease'
                  }}
                  className="card-overlay-hover"
                  >
                    <span className="btn-liquid" style={{ padding: '10px 20px', fontSize: '0.78rem' }}>
                      OPEN MODULE ↗
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginBottom: '6px' }}>
                      {module.title}
                    </h3>
                    <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-grape-light)', marginBottom: '12px' }}>
                      {module.subtitle}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {module.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: '#ffffff' }}>
                      LAUNCH APP
                    </span>
                    <ArrowUpRight size={18} color="var(--color-grape-light)" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CLUNK BENTO SERVICES GRID ("CORE CAPABILITIES") */}
      <section style={{ textAlign: 'left' }}>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
          WHY USERS DITCH TRADITIONAL STUDYING
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: '8px', marginBottom: '32px' }}>
          THE CLUNK <span style={{ color: 'var(--color-grape-light)' }}>STUDY ENGINE</span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          <div style={{ background: '#0e0e14', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', padding: '32px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: 'var(--color-grape-light)', fontWeight: 800 }}>01</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', margin: '16px 0 10px 0' }}>
              SUPERMEMO SM-2 ALGORITHM
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Eliminates the forgetting curve. Flashcards adapt dynamically based on your ease factor, repetition intervals, and retention feedback.
            </p>
          </div>

          <div style={{ background: '#0e0e14', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', padding: '32px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: 'var(--color-grape-light)', fontWeight: 800 }}>02</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', margin: '16px 0 10px 0' }}>
              SOCRATIC AI VOICE TUTOR
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Instead of giving plain answers, our AI tutor guides you through Socratic questioning, Feynman explanations, and exam drills.
            </p>
          </div>

          <div style={{ background: '#0e0e14', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', padding: '32px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: 'var(--color-grape-light)', fontWeight: 800 }}>03</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', margin: '16px 0 10px 0' }}>
              NEURAL MIND MAPPING
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Transform isolated facts into interconnected mental models. Connect study notes directly to flashcard topics on a 2D interactive canvas.
            </p>
          </div>
        </div>
      </section>

      {/* 5. IMPACT NUMBERS COUNTER (Clunk Style) */}
      <section style={{
        background: 'linear-gradient(135deg, #09090e, #13131c)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '48px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '36px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 900, color: 'var(--color-grape-light)' }}>
            98.4%
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginTop: '8px' }}>
            RETENTION RATE
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 900, color: '#ffffff' }}>
            {totalCards}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginTop: '8px' }}>
            ACTIVE FLASHCARDS
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
            2.5X
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginTop: '8px' }}>
            FASTER RECALL SPEED
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
            0%
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginTop: '8px' }}>
            BORING UI
          </div>
        </div>
      </section>

      {/* 6. ANALYTICS & WEEKLY ACTIVITY DASHBOARD */}
      <section style={{ textAlign: 'left' }}>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
          PERFORMANCE ANALYTICS
        </span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: '8px', marginBottom: '28px' }}>
          STUDY INSIGHTS & <span style={{ color: 'var(--color-grape-light)' }}>PROGRESS</span>
        </h2>

        {/* Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          marginBottom: '36px'
        }}>
          <div className="glass-panel" onClick={() => setActiveTab('flashcards')} style={{ padding: '24px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>SRS DUE TODAY</span>
              <Layers size={20} color="var(--color-grape-light)" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{dueTodayCount}</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-grape-light)', marginTop: '6px' }}>
              Out of {totalCards} cards across {decks.length} decks
            </p>
          </div>

          <div className="glass-panel" onClick={() => setActiveTab('notes')} style={{ padding: '24px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>SMART NOTES</span>
              <BookOpen size={20} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{totalNotes}</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginTop: '6px' }}>
              Markdown + KaTeX LaTeX support
            </p>
          </div>

          <div className="glass-panel" onClick={() => setActiveTab('quizzes')} style={{ padding: '24px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>QUIZ ACCURACY</span>
              <HelpCircle size={20} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{lastScore}%</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '6px' }}>
              Based on recent practice drills
            </p>
          </div>

          <div className="glass-panel" onClick={() => setActiveTab('mindmap')} style={{ padding: '24px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>MASTERY RATE</span>
              <Award size={20} color="var(--accent-amber)" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{masteryPercentage}%</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', marginTop: '6px' }}>
              {masteredCount} cards permanently mastered
            </p>
          </div>
        </div>

        {/* Main Grid: Chart & Subject Mastery */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          <ActivityChart />

          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <Target size={20} color="var(--color-grape-light)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', textTransform: 'uppercase' }}>SUBJECT MASTERY</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px', fontWeight: 700 }}>
                    <span style={{ color: '#ffffff' }}>Computer Science (AI/ML)</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>78%</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px', fontWeight: 700 }}>
                    <span style={{ color: '#ffffff' }}>Physics (Quantum Mechanics)</span>
                    <span style={{ color: 'var(--color-grape-light)' }}>62%</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg, #9333ea, #c084fc)', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px', fontWeight: 700 }}>
                    <span style={{ color: '#ffffff' }}>Biology (Cellular Bio)</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>88%</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '88%', height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
                <span>Next target: Complete Physics Carnot Problem Set</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
