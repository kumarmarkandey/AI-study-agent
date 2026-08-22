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
  X,
  Flame,
  Zap
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

  if (!isOpen && window.innerWidth < 1024) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 49,
            display: 'block'
          }}
        />
      )}

      {/* Sidebar Drawer (Mobile & Compact View) */}
      <aside 
        style={{
          width: '260px',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          background: 'rgba(5, 5, 5, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
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
          {/* Logo & Close */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px',
            marginBottom: '28px'
          }}>
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
                fontSize: '1rem'
              }}>
                C
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '1.05rem', 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 900, 
                  letterSpacing: '0.08em', 
                  color: 'white',
                  textTransform: 'uppercase' 
                }}>
                  CLUNK <span style={{ color: 'var(--color-grape-light)' }}>STUDY</span>
                </h1>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  BUILD YOUR BRAIN
                </p>
              </div>
            </div>

            {onClose && (
              <button 
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Nav Items */}
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
                    borderRadius: '10px',
                    border: isActive ? '1px solid var(--color-grape-light)' : '1px solid transparent',
                    background: isActive ? 'rgba(147, 51, 234, 0.15)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: isActive ? 800 : 600,
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} color={isActive ? 'var(--color-grape-light)' : 'var(--text-muted)'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="badge badge-grape" style={{ fontSize: '0.62rem' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Clunk Status Footer */}
        <div style={{ 
          padding: '16px', 
          borderRadius: '14px', 
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Zap size={14} color="var(--color-grape-light)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: '#ffffff' }}>
              CLUNK COGNITIVE OS
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Active recall engine & Socratic AI ready.
          </p>
        </div>
      </aside>
    </>
  );
}
