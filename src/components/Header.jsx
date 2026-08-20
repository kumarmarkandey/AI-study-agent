import React from 'react';
import { Flame, Clock, Settings, Volume2, Key, Menu } from 'lucide-react';
import { getSoundscapeState } from '../services/webAudioSynth';

export function Header({ activeTab, streak, onOpenSettings, apiKey, onToggleMobileMenu }) {
  const titles = {
    dashboard: 'Study Dashboard & Insights',
    flashcards: 'Spaced Repetition AI Flashcards',
    quizzes: 'AI Practice Quizzes & Exams',
    notes: 'Smart Notes & AI Assistant',
    tutor: 'Socratic AI Academic Tutor',
    focus: 'Pomodoro Timer & Focus Audio',
    mindmap: 'Interactive Knowledge Mind Map',
    planner: 'Study Task Planner & Kanban'
  };

  const soundState = getSoundscapeState();

  return (
    <header 
      className="header-container"
      style={{
        height: '72px',
        position: 'sticky',
        top: 0,
        background: 'rgba(9, 13, 22, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        marginLeft: '260px',
        zIndex: 40,
        transition: 'margin-left 0.3s ease'
      }}
    >
      {/* Mobile Toggle & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onToggleMobileMenu}
          className="btn-secondary"
          style={{
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.3px', color: 'white' }}>
          {titles[activeTab] || 'OmniStudy AI'}
        </h2>
      </div>

      {/* Header Actions & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Active Audio Playing Indicator */}
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
          borderRadius: '20px',
          color: '#f59e0b',
          fontWeight: 700,
          fontSize: '0.85rem'
        }}>
          <Flame size={16} fill="#f59e0b" />
          <span>{streak.currentStreak} Day Streak</span>
        </div>

        {/* Total Hours */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          padding: '6px 12px',
          borderRadius: '20px',
          color: 'var(--accent-cyan)',
          fontWeight: 600,
          fontSize: '0.85rem'
        }}>
          <Clock size={16} />
          <span>{streak.totalHours} hrs</span>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="btn-secondary"
          style={{ padding: '8px 12px', borderRadius: '10px' }}
          title="Settings & Gemini API Key"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
