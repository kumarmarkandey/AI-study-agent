import React, { useState } from 'react';
import { BookOpen, Layers, ArrowRight } from 'lucide-react';

export function MindMapCanvas({ decks, notes, onNavigateToDeck, onNavigateToNote }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Generate nodes from decks and notes
  const nodes = [
    { id: 'root', label: 'OmniStudy Knowledge Network', type: 'root', x: 400, y: 220, color: '#38bdf8' },

    // Subject Hubs
    { id: 'subj-cs', label: 'Computer Science', type: 'subject', x: 200, y: 120, color: '#38bdf8', parent: 'root' },
    { id: 'subj-phys', label: 'Quantum Physics', type: 'subject', x: 600, y: 120, color: '#a855f7', parent: 'root' },
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
      color: d.color || '#38bdf8',
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
      color: '#a855f7',
      parent: n.subject === 'Physics' ? 'subj-phys' : n.subject === 'Biology' ? 'subj-bio' : 'subj-cs'
    }))
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>Interactive Knowledge Mind Map</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Visualize connections between subject domains, smart notes, and spaced repetition flashcard decks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge badge-cyan" style={{ gap: '6px' }}><Layers size={13} /> Flashcard Decks</span>
          <span className="badge badge-violet" style={{ gap: '6px' }}><BookOpen size={13} /> Smart Notes</span>
        </div>
      </div>

      {/* Mind Map Canvas */}
      <div className="glass-panel" style={{ position: 'relative', width: '100%', height: '520px', overflow: 'hidden', borderRadius: '22px' }}>
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
            const radius = n.type === 'root' ? 28 : n.type === 'subject' ? 22 : 16;

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
                    filter: isSelected ? `drop-shadow(0 0 14px ${n.color})` : 'none'
                  }}
                />
                <circle cx={n.x} cy={n.y} r={radius / 2.5} fill={n.color} />

                {/* Node Label */}
                <text
                  x={n.x}
                  y={n.y + radius + 18}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize={n.type === 'root' ? 13 : 11}
                  fontWeight={n.type === 'root' || n.type === 'subject' ? 700 : 500}
                  fontFamily="var(--font-heading)"
                >
                  {n.label.length > 25 ? n.label.slice(0, 22) + '...' : n.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="glass-panel" style={{
            position: 'absolute',
            bottom: '22px',
            right: '22px',
            width: '320px',
            padding: '22px',
            background: 'rgba(11, 15, 25, 0.96)',
            borderColor: selectedNode.color,
            boxShadow: `0 8px 30px rgba(0,0,0,0.6), 0 0 20px ${selectedNode.color}30`
          }}>
            <button
              onClick={() => setSelectedNode(null)}
              style={{ position: 'absolute', right: '14px', top: '14px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              ×
            </button>

            <span className="badge" style={{ background: `${selectedNode.color}20`, color: selectedNode.color, marginBottom: '8px' }}>
              {selectedNode.type.toUpperCase()}
            </span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: '6px 0 14px' }}>
              {selectedNode.label}
            </h4>

            {selectedNode.type === 'deck' && (
              <button
                onClick={() => onNavigateToDeck(selectedNode.item)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                <span>Open Deck</span>
                <ArrowRight size={16} />
              </button>
            )}

            {selectedNode.type === 'note' && (
              <button
                onClick={() => onNavigateToNote(selectedNode.item)}
                className="btn-violet"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                <span>Read Smart Note</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
