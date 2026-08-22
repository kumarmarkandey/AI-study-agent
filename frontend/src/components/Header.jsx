import React, { useState } from 'react';
import { Flame, Clock, Settings, Key, Menu, X, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { getSoundscapeState } from '../services/webAudioSynth';

export function Header({ activeTab, setActiveTab, streak, onOpenSettings, apiKey, onToggleMobileMenu }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const soundState = getSoundscapeState();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', badge: 'OVERVIEW', num: '01' },
    { id: 'flashcards', label: 'AI Flashcards', badge: 'SUPERMEMO SM-2', num: '02' },
    { id: 'quizzes', label: 'Practice Quizzes', badge: 'SMART DRILLS', num: '03' },
    { id: 'notes', label: 'Smart Notes', badge: 'AI ASSISTANT', num: '04' },
    { id: 'tutor', label: 'Socratic Tutor', badge: 'SOCRATIC AI', num: '05' },
    { id: 'focus', label: 'Focus & Audio', badge: 'POMODORO SYNTH', num: '06' },
    { id: 'mindmap', label: 'Knowledge Map', badge: 'NEURAL GRAPH', num: '07' },
    { id: 'planner', label: 'Task Planner', badge: 'KANBAN FLOW', num: '08' },
  ];

  const handleNavClick = (tabId) => {
    if (setActiveTab) setActiveTab(tabId);
    setIsOverlayOpen(false);
  };

  return (
    <>
      <header 
        className="header-container"
        style={{
          height: '76px',
          position: 'sticky',
          top: 0,
          background: 'rgba(5, 5, 5, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          zIndex: 60,
          transition: 'all 0.3s ease'
        }}
      >
        {/* Brand Lockup (Clunk Style) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            onClick={() => handleNavClick('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              letterSpacing: '-1px'
            }}>
              C
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 900, 
                  fontSize: '1.15rem', 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase',
                  color: '#ffffff'
                }}>
                  CLUNK<span style={{ color: 'var(--color-grape-light)', fontSize: '0.8rem', verticalAlign: 'super' }}>®</span>
                </span>
                <span style={{ opacity: 0.3, color: '#ffffff' }}>×</span>
                <span style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 800, 
                  fontSize: '0.88rem', 
                  letterSpacing: '0.1em',
                  color: 'var(--color-paper)'
                }}>
                  OMNISTUDY
                </span>
              </div>
            </div>
          </div>

          <span className="badge badge-grape" style={{ display: window.innerWidth < 768 ? 'none' : 'inline-flex' }}>
            STUDY OS 2.0
          </span>
        </div>

        {/* Inline Navigation Links (Clunk Desktop Bar) */}
        <nav 
          style={{ 
            display: window.innerWidth < 1100 ? 'none' : 'flex', 
            alignItems: 'center', 
            gap: '22px' 
          }}
        >
          {navItems.slice(0, 6).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: isActive ? 800 : 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  padding: '6px 0',
                  position: 'relative',
                  transition: 'color 0.2s ease'
                }}
              >
                {item.label}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--color-grape)',
                    borderRadius: '2px',
                    boxShadow: '0 0 10px var(--color-grape)'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Soundscape Indicator */}
          {soundState.isPlaying && (
            <div className="badge badge-emerald" style={{ padding: '6px 12px', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>
                <div className="eq-bar" />
                <div className="eq-bar" />
                <div className="eq-bar" />
              </div>
              <span>Audio Active</span>
            </div>
          )}

          {/* API Key Status Badge */}
          <div 
            onClick={onOpenSettings} 
            style={{ cursor: 'pointer' }}
            className={apiKey ? "badge badge-cyan" : "badge badge-amber"} 
            title={apiKey ? "Live Gemini API Active" : "Using Built-in AI Engine (Click to add API Key)"}
          >
            <Key size={12} />
            <span>{apiKey ? "Gemini Live" : "Built-in AI"}</span>
          </div>

          {/* Streak Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '6px 12px',
            borderRadius: '9999px',
            color: '#f59e0b',
            fontWeight: 800,
            fontSize: '0.78rem',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.05em'
          }}>
            <Flame size={14} fill="#f59e0b" />
            <span>{streak.currentStreak}D STREAK</span>
          </div>

          {/* Liquid Action Button */}
          <button
            onClick={onOpenSettings}
            className="btn-liquid clunk-shimmer"
            style={{ padding: '9px 18px', fontSize: '0.75rem' }}
          >
            <span>SETTINGS</span>
            <span className="clunk-shimmer-sweep" />
          </button>

          {/* Clunk Hamburger Overlay Trigger */}
          <button
            onClick={() => setIsOverlayOpen(true)}
            aria-label="Open menu"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Clunk Signature Fullscreen Navigation Overlay */}
      {isOverlayOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: '#050505',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '32px 40px',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {/* Overlay Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem'
              }}>
                C
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.1em' }}>
                CLUNK® STUDY MENU
              </span>
            </div>

            <button
              onClick={() => setIsOverlayOpen(false)}
              style={{
                marginLeft: 'auto',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Fullscreen Navigation Links Grid with Clunk Ticker Effect */}
          <div style={{ margin: 'auto 0', width: '100%', maxWidth: '800px', alignSelf: 'center' }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;

                return (
                  <li key={item.id} className="group-hover-ticker" style={{ position: 'relative' }}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        padding: '8px 0',
                        position: 'relative',
                        zIndex: 10
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '1rem', 
                          color: 'var(--color-grape-light)',
                          fontWeight: 700 
                        }}>
                          {item.num}
                        </span>
                        <span style={{ 
                          fontFamily: 'var(--font-display)', 
                          fontWeight: 900, 
                          fontSize: 'clamp(2rem, 5vw, 3.8rem)', 
                          textTransform: 'uppercase',
                          color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                          letterSpacing: '-0.02em',
                          transition: 'color 0.2s ease'
                        }}>
                          {item.label}
                        </span>
                      </div>

                      <span className="badge badge-grape" style={{ fontSize: '0.75rem' }}>
                        {item.badge}
                      </span>
                    </button>

                    {/* Clunk Diagonal Ticker Banner on Hover */}
                    <div className="diagonal-ticker-banner">
                      <div className="clunk-ticker-x">
                        <div className="clunk-ticker-item">
                          <span>{item.label}</span> <span className="star">★</span>
                          <span>ACTIVE RECALL</span> <span className="star">★</span>
                          <span>SPACED REPETITION</span> <span className="star">★</span>
                          <span>CLUNK OS</span> <span className="star">★</span>
                        </div>
                        <div className="clunk-ticker-item">
                          <span>{item.label}</span> <span className="star">★</span>
                          <span>ACTIVE RECALL</span> <span className="star">★</span>
                          <span>SPACED REPETITION</span> <span className="star">★</span>
                          <span>CLUNK OS</span> <span className="star">★</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Overlay Footer Info */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            paddingTop: '20px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            <span>CLUNK® STUDY OPERATING SYSTEM</span>
            <span>2026 EDITION</span>
          </div>
        </div>
      )}
    </>
  );
}
