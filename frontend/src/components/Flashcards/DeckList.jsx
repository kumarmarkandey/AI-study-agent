import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Atom, 
  Dna, 
  Play, 
  Trash2,
  Layers,
  ArrowUpRight
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', textAlign: 'left' }}>
      {/* Title Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
            SPACED REPETITION ENGINE
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: '8px' }}>
            AI FLASHCARD <span style={{ color: 'var(--color-grape-light)' }}>DECKS</span>
          </h1>
        </div>

        <button onClick={() => setIsAiModalOpen(true)} className="btn-liquid clunk-shimmer">
          <Sparkles size={16} />
          <span>GENERATE DECK WITH AI ↗</span>
          <span className="clunk-shimmer-sweep" />
        </button>
      </div>

      {/* Subject Filter Pills */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {subjects.map(subj => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              border: selectedSubject === subj ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.18)',
              background: selectedSubject === subj ? '#ffffff' : 'transparent',
              color: selectedSubject === subj ? '#000000' : 'rgba(255, 255, 255, 0.7)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Grid of Decks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '32px'
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
              className="clunk-card"
              onClick={() => onSelectDeck(deck)}
              style={{
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                minHeight: '290px',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(147, 51, 234, 0.18)',
                    border: '1px solid rgba(147, 51, 234, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    color: 'var(--color-grape-light)'
                  }}>
                    <SubjectIcon size={22} />
                  </div>

                  <span className="badge badge-grape">
                    {deck.subject}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', color: 'white', fontFamily: 'var(--font-display)' }}>
                  {deck.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {deck.description}
                </p>
              </div>

              <div>
                {/* Mastery Progress Bar */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span>{masteredCards}/{totalCards} Mastered ({masteryPercent}%)</span>
                    {dueCards > 0 && <span style={{ color: 'var(--color-grape-light)', fontWeight: 700 }}>★ {dueCards} DUE TODAY</span>}
                  </div>
                  <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${masteryPercent}%`, height: '100%', background: 'var(--color-grape-light)', borderRadius: '3px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.78rem' }}>
                    <Play size={14} />
                    <span>START REVIEW ↗</span>
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteDeck(deck.id); }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
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
