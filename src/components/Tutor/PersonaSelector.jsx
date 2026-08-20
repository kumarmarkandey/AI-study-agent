import React from 'react';
import { Brain, Zap, GraduationCap, Code } from 'lucide-react';

export function PersonaSelector({ activePersona, onSelectPersona }) {
  const personas = [
    {
      id: 'socratic',
      title: 'Socratic Mentor',
      icon: Brain,
      color: '#38bdf8',
      description: 'Guides step-by-step with probing questions rather than revealing final answers directly.'
    },
    {
      id: 'eli5',
      title: 'ELI5 Explainer',
      icon: Zap,
      color: '#f59e0b',
      description: 'Explains tough concepts using simple everyday words and vivid real-world analogies.'
    },
    {
      id: 'coach',
      title: 'Exam Coach',
      icon: GraduationCap,
      color: '#a855f7',
      description: 'Tough test prep drills highlighting common exam traps and trick questions.'
    },
    {
      id: 'codemath',
      title: 'Code & Math Solver',
      icon: Code,
      color: '#10b981',
      description: 'Provides clean LaTeX math derivations and formatted code implementations.'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
      {personas.map(p => {
        const Icon = p.icon;
        const isActive = activePersona === p.id;

        return (
          <button
            key={p.id}
            onClick={() => onSelectPersona(p.id)}
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: isActive ? `1px solid ${p.color}` : '1px solid var(--border-color)',
              background: isActive ? `${p.color}18` : 'rgba(255, 255, 255, 0.03)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: isActive ? `0 0 20px ${p.color}25` : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon size={18} color={p.color} />
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: isActive ? p.color : 'white' }}>
                {p.title}
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
              {p.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
