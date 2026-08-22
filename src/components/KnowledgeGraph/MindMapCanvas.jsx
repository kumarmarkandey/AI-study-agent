import React, { useState } from 'react';
import { BookOpen, Layers, ArrowRight } from 'lucide-react';

export function MindMapCanvas({ decks, notes, onNavigateToDeck, onNavigateToNote }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Generate nodes from decks and notes
  const nodes = [
    { id: 'root', label: 'CLUNK KNOWLEDGE OS', type: 'root', x: 400, y: 220, color: 'var(--color-grape-light)' },

    // Subject Hubs
    { id: 'subj-cs', label: 'Computer Science', type: 'subject', x: 200, y: 120, color: '#38bdf8', parent: 'root' },
    { id: 'subj-phys', label: 'Quantum Physics', type: 'subject', x: 600, y: 120, color: 'var(--color-grape-light)', parent: 'root' },
    { id: 'subj-bio', label: 'Cellular Biology', type: 'subject', x: 400, y: 360, color: '#10b981', parent: 'root' },

    // Dynamic items
    ...decks.map((d, i) => ({
      id: `deck-${d.id}`,
      label: d.title,
      type: 'deck',
      subject: d.subject,
      item: d,
      x: d.subject === 'Physics' ? 680 + (i * 20) : d.subject === 'Biology' ? 520 : 120 + (i * 40),
      y: d.subject === 'Physics' ? 200 : d.subject === 'Biology' ? 440 : 200 + (i * 60),
      color: 'var(--color-grape-light)',
      parent: d.subject === 'Physics' ? 'subj-phys' : d.subject === 'Biology' ? 'subj-bio' : 'subj-cs'
    })),

    ...notes.map((n, i) => ({
      id: `note-${n.id}`,
      label: n.title,
      type: 'note',
      subject: n.subject,
      item: n,
      x: n.subject === 'Physics' ? 540 : n.subject === 'Biology' ? 280 : 100,
      y: n.subject === 'Physics' ? 40 : n.subject === 'Biology' ? 420 : 60 + (i * 70),
      color: '#ffffff',
      parent: n.subject === 'Physics' ? 'subj-phys' : n.subject === 'Biology' ? 'subj-bio' : 'subj-cs'
    }))
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
            NEURAL GRAPH & KNOWLEDGE CANVAS
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: '8px' }}>
            INTERACTIVE <span style={{ color: 'var(--color-grape-light)' }}>MIND MAP</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-grape" style={{ gap: '6px' }}><Layers size={13} /> FLASHCARD DECKS</span>
          <span className="badge badge-white" style={{ gap: '6px' }}><BookOpen size={13} /> SMART NOTES</span>
        </div>
      </div>

      {/* Mind Map Canvas */}
      <div className="clunk-card" style={{ position: 'relative', width: '100%', height: '540px', overflow: 'hidden', background: '#0a0a0f', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 500" style={{ width: '100%', height: '100%' }}>
          {/* Connector Lines */}
          {nodes.filter(n => n.parent).map(n => {
            const parentNode = nodes.find(p => p.id === n.parent);
            if (!parentNode) return null;

            return (
              <line
                key={`link-${n.id}`}
                x1={parentNode.x}
                y1={parentNode.y}
                x2={n.x}
                y2={n.y}
                stroke={n.color}
                strokeWidth="2"
                strokeOpacity="0.4"
                strokeDasharray={n.type === 'note' ? '4 4' : 'none'}
              />
            );
          })}

          {/* Node Elements */}
          {nodes.map(n => {
            const isSelected = selectedNode?.id === n.id;
            const radius = n.type === 'root' ? 30 : n.type === 'subject' ? 24 : 18;

            return (
              <g
                key={n.id}
                onClick={() => setSelectedNode(n)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={radius}
                  fill={`${n.color}25`}
                  stroke={n.color}
                  strokeWidth={isSelected ? 3 : 2}
                  style={{
                    filter: isSelected ? `drop-shadow(0 0 16px ${n.color})` : 'none'
                  }}
                />
                <circle cx={n.x} cy={n.y} r={radius / 2.5} fill={n.color} />

                {/* Node Label */}
                <text
                  x={n.x}
                  y={n.y + radius + 18}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={n.type === 'root' ? 12 : 10}
                  fontWeight={800}
                  fontFamily="var(--font-display)"
                  letterSpacing="0.05em"
                >
                  {n.label.length > 25 ? n.label.slice(0, 22) + '...' : n.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="clunk-card" style={{
            position: 'absolute',
            bottom: '22px',
            right: '22px',
            width: '320px',
            padding: '24px',
            background: '#0e0e14',
            borderColor: selectedNode.color,
            boxShadow: `0 10px 40px rgba(0,0,0,0.8)`
          }}>
            <button
              onClick={() => setSelectedNode(null)}
              style={{ position: 'absolute', right: '14px', top: '14px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ×
            </button>

            <span className="badge badge-grape" style={{ marginBottom: '8px' }}>
              {selectedNode.type.toUpperCase()}
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', margin: '8px 0 16px', fontFamily: 'var(--font-display)' }}>
              {selectedNode.label}
            </h4>

            {selectedNode.type === 'deck' && (
              <button
                onClick={() => onNavigateToDeck(selectedNode.item)}
                className="btn-liquid clunk-shimmer"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                <span>OPEN DECK ↗</span>
              </button>
            )}

            {selectedNode.type === 'note' && (
              <button
                onClick={() => onNavigateToNote(selectedNode.item)}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                <span>READ SMART NOTE ↗</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
