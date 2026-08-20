import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  Bot, 
  Timer, 
  Network, 
  CheckSquare,
  Sparkles,
  X
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'flashcards', label: 'AI Flashcards', icon: Layers, badge: 'SRS' },
    { id: 'quizzes', label: 'Practice Quizzes', icon: HelpCircle },
    { id: 'notes', label: 'Smart Notes', icon: BookOpen, badge: 'AI' },
    { id: 'tutor', label: 'Socratic Tutor', icon: Bot },
    { id: 'focus', label: 'Focus & Audio', icon: Timer },
    { id: 'mindmap', label: 'Knowledge Map', icon: Network },
    { id: 'planner', label: 'Task Planner', icon: CheckSquare },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 8, 16, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 49,
            display: 'block'
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className="sidebar-drawer"
        style={{
          width: '260px',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          background: 'rgba(11, 15, 25, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 18px',
          zIndex: 50,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen || window.innerWidth >= 1024 ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        <div>
          {/* Logo & Close Button Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow-cyan)'
              }}>
                <Sparkles size={22} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'white' }}>
                  Omni<span className="gradient-text-cyan">Study AI</span>
                </h1>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Smart Cognitive Companion
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onClose && (
              <button 
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: window.innerWidth < 1024 ? 'block' : 'none'
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.16) 0%, rgba(168, 85, 247, 0.12) 100%)' : 'transparent',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={19} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={item.badge === 'SRS' ? 'badge badge-cyan' : 'badge badge-violet'} style={{ fontSize: '0.65rem' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Assistant Quick Status */}
        <div className="glass-panel" style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              AI Cognitive Engine
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            SRS flashcards, quiz drills & Socratic tutoring active.
          </p>
        </div>
      </aside>
    </>
  );
}
