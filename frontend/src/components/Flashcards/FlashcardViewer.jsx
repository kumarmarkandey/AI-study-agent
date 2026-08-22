import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  Volume2, 
  Star, 
  CornerDownLeft,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateSRS } from '../../services/srsAlgorithm';

export function FlashcardViewer({ deck, onUpdateDeck, onBack }) {
  const [cards, setCards] = useState(deck.cards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState(0);

  const currentCard = cards[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCompleted || !currentCard) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRating(1);
        if (e.key === '2') handleRating(2);
        if (e.key === '3') handleRating(3);
        if (e.key === '4') handleRating(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, isCompleted, currentCard]);

  const handleRating = (rating) => {
    if (!currentCard) return;

    const updatedCard = calculateSRS(currentCard, rating);
    const updatedCards = cards.map((c, i) => i === currentIndex ? updatedCard : c);
    
    setCards(updatedCards);
    setSessionReviewed(prev => prev + 1);

    onUpdateDeck({
      ...deck,
      cards: updatedCards
    });

    if (currentIndex + 1 < cards.length) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (e) {
        // Confetti optional
      }
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleStar = () => {
    if (!currentCard) return;
    const updatedCard = { ...currentCard, starred: !currentCard.starred };
    const updatedCards = cards.map((c, i) => i === currentIndex ? updatedCard : c);
    setCards(updatedCards);
    onUpdateDeck({ ...deck, cards: updatedCards });
  };

  if (isCompleted) {
    return (
      <div className="clunk-card" style={{ padding: '56px', textAlign: 'center', maxWidth: '680px', margin: '40px auto' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-grape) 0%, var(--color-grape-deep) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: '0 0 30px var(--color-grape-glow)'
        }}>
          <Award size={44} color="white" />
        </div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', color: 'white', fontFamily: 'var(--font-display)' }}>
          DECK REVIEW COMPLETE! 🎉
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem', lineHeight: 1.65 }}>
          You reviewed <strong>{sessionReviewed} cards</strong> in <strong>{deck.title}</strong> using the SuperMemo SM-2 algorithm.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <button onClick={onBack} className="btn-liquid clunk-shimmer">
            <ArrowLeft size={16} />
            <span>RETURN TO DECKS ↗</span>
          </button>
          <button onClick={() => { setCurrentIndex(0); setIsFlipped(false); setIsCompleted(false); setSessionReviewed(0); }} className="btn-secondary">
            <RotateCw size={16} />
            <span>REVIEW AGAIN</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="clunk-card" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No cards available in this deck.</p>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '20px' }}>
          BACK TO DECKS
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', textAlign: 'left' }}>
      {/* Top Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="btn-secondary" style={{ gap: '8px' }}>
          <ArrowLeft size={16} />
          <span>EXIT SESSION</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: 'var(--color-grape-light)' }}>
            CARD {currentIndex + 1} OF {cards.length}
          </span>
        </div>

        <button onClick={toggleStar} className="btn-secondary" style={{ padding: '10px 16px' }}>
          <Star size={18} color={currentCard.starred ? "#f59e0b" : "var(--text-muted)"} fill={currentCard.starred ? "#f59e0b" : "transparent"} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-grape), var(--color-grape-light))', transition: 'width 0.3s ease' }} />
      </div>

      {/* 3D Flip Flashcard */}
      <div 
        className={`card-flip-container ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(prev => !prev)}
        style={{ cursor: 'pointer' }}
      >
        <div className="card-flip-inner">
          {/* FRONT */}
          <div className="card-face" style={{ background: '#0e0e14', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <span className="badge badge-grape">{deck.subject}</span>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SPACEBAR TO FLIP</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.5, color: 'white' }}>
                {currentCard.front}
              </h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSpeak(currentCard.front); }}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                <Volume2 size={16} />
                <span>LISTEN</span>
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CornerDownLeft size={16} /> FLIP CARD
              </span>
            </div>
          </div>

          {/* BACK */}
          <div className="card-face card-face-back" style={{ background: '#12121c', border: '1px solid var(--color-grape-light)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <span className="badge badge-grape">ANSWER & EXPLANATION</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-grape-light)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>SRS EASE: {currentCard.easeFactor}X</span>
              </div>
              <div style={{ fontSize: '1.25rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: '#f1f5f9' }}>
                {currentCard.back}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSpeak(currentCard.back); }}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                <Volume2 size={16} />
                <span>LISTEN ANSWER</span>
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RATE RECALL (1-4)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SRS Rating Action Buttons */}
      {isFlipped ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <button 
            onClick={() => handleRating(1)} 
            style={{
              padding: '16px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#f43f5e',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.95rem' }}>1. AGAIN</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>1 day</span>
          </button>

          <button 
            onClick={() => handleRating(2)} 
            style={{
              padding: '16px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.95rem' }}>2. HARD</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>2 days</span>
          </button>

          <button 
            onClick={() => handleRating(3)} 
            style={{
              padding: '16px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(147, 51, 234, 0.4)',
              background: 'rgba(147, 51, 234, 0.2)',
              color: 'var(--color-grape-light)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.95rem' }}>3. GOOD</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>4 days</span>
          </button>

          <button 
            onClick={() => handleRating(4)} 
            style={{
              padding: '16px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.95rem' }}>4. EASY</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>6+ days</span>
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
          💡 Click card or press <strong>Spacebar</strong> to reveal answer
        </div>
      )}
    </div>
  );
}
