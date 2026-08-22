import React from 'react';
import { ArrowUpRight, Sparkles, Heart } from 'lucide-react';

export function Footer({ onOpenSettings, setActiveTab }) {
  return (
    <footer 
      style={{
        backgroundColor: '#000000',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        color: '#ffffff',
        padding: '64px 28px 32px 28px',
        marginTop: '60px'
      }}
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Massive Clunk Call-To-Action Banner */}
        <div 
          style={{
            background: 'linear-gradient(145deg, #0e0e14, #151522)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '24px',
            padding: '48px 36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '24px',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '64px'
          }}
        >
          <span className="badge badge-grape">READY TO ELEVATE YOUR STUDY GAME?</span>
          
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', 
            fontWeight: 900, 
            letterSpacing: '-0.03em', 
            lineHeight: 0.95,
            textTransform: 'uppercase',
            maxWidth: '900px'
          }}>
            Ditch Average Studying.<br />
            <span style={{ color: 'var(--color-grape-light)' }}>Build The Brain</span> People Don’t Forget.
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Spaced repetition flashcards, Socratic AI tutoring, smart quizzes, binaural soundscapes, and knowledge mapping — all in one hyper-focused study operating system.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
            <button 
              onClick={() => setActiveTab('flashcards')}
              className="btn-liquid clunk-shimmer"
            >
              <span>START STUDYING NOW ↗</span>
              <span className="clunk-shimmer-sweep" />
            </button>

            <button 
              onClick={onOpenSettings}
              className="btn-secondary"
            >
              CONFIGURE GEMINI API KEY
            </button>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontFamily: 'var(--font-display)'
              }}>
                C
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.1em' }}>
                CLUNK® STUDY
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              The high-contrast, AI-powered cognitive companion for students, developers, and lifelong learners worldwide.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ffffff', marginBottom: '16px' }}>
              AI MODULES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => setActiveTab('flashcards')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  SuperMemo SM-2 Flashcards
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('quizzes')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Practice Quizzes & Exams
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('notes')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Smart Markdown Notes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tutor')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Socratic Voice AI Tutor
                </button>
              </li>
            </ul>
          </div>

          {/* Productivity Tools */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ffffff', marginBottom: '16px' }}>
              PRODUCTIVITY OS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => setActiveTab('focus')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Soundscape Pomodoro Timer
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('mindmap')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Interactive Knowledge Mind Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('planner')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Kanban Task Planner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Analytics & Streak Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ffffff', marginBottom: '16px' }}>
              ENGINE & STACK
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>
              Powered by Google Gemini 1.5/2.0 API, Web Audio Synthesizer, SuperMemo SM-2 Spaced Repetition, and React 19.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          paddingTop: '28px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <span>CLUNK® STUDY AGENT • DITCH AVERAGE</span>
          <span>© 2026 CLUNK COGNITIVE DESIGN. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
}
