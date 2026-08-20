import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Brain, 
  Atom, 
  Dna, 
  Play, 
  Trash2
} from 'lucide-react';
import { AIDeckGeneratorModal } from './AIDeckGeneratorModal';

export function DeckList({ decks, onSelectDeck, onCreateDeck, onDeleteDeck, apiKey }) {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const subjects = ['All', 'Computer Science', 'Physics', 'Biology'];

  const filteredDecks = selectedSubject === 'All' 
    ? decks 
    : decks.filter(d => d.subject === selectedSubject);

  const getSubjectIcon = (subject) => {
    if (subject === 'Physics') return Atom;
    if (subject === 'Biology') return Dna;
    return Brain;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Filter Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Subject Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {subjects.map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: selectedSubject === subj ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                background: selectedSubject === subj ? 'rgba(56, 189, 248, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedSubject === subj ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Create / Generate Action */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setIsAiModalOpen(true)} className="btn-violet">
            <Sparkles size={16} />
            <span>Generate Deck with AI</span>
          </button>
        </div>
      </div>

      {/* Grid of Decks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '22px'
      }}>
        {filteredDecks.map(deck => {
          const SubjectIcon = getSubjectIcon(deck.subject);
          const totalCards = deck.cards.length;
          const masteredCards = deck.cards.filter(c => c.mastered).length;
          const todayStr = new Date().toISOString().split('T')[0];
          const dueCards = deck.cards.filter(c => c.dueDate <= todayStr && !c.mastered).length;
          const masteryPercent = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

          return (
            <div 
              key={deck.id} 
              className="glass-panel glass-card-interactive"
              onClick={() => onSelectDeck(deck)}
              style={{
                padding: '26px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                minHeight: '230px',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: `${deck.color || '#38bdf8'}20`,
                    border: `1px solid ${deck.color || '#38bdf8'}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    color: deck.color || '#38bdf8'
                  }}>
                    <SubjectIcon size={22} />
                  </div>

                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                    {deck.subject}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
                  {deck.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
                  {deck.description}
                </p>
              </div>

              <div>
                {/* Mastery Progress Bar */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>{masteredCards}/{totalCards} Mastered ({masteryPercent}%)</span>
                    {dueCards > 0 && <span style={{ color: '#f59e0b', fontWeight: 700 }}>{dueCards} Due</span>}
                  </div>
                  <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${masteryPercent}%`, height: '100%', background: deck.color || '#38bdf8', borderRadius: '4px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.86rem' }}>
                    <Play size={14} />
                    <span>Start Review</span>
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteDeck(deck.id); }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'color 0.2s ease' }}
                    title="Delete Deck"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AIDeckGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onDeckCreated={onCreateDeck}
        apiKey={apiKey}
      />
    </div>
  );
}
