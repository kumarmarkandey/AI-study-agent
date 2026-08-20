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

    // Save updated deck state
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
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
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
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', maxWidth: '620px', margin: '40px auto' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 24px',
          boxShadow: 'var(--shadow-glow-emerald)'
        }}>
          <Award size={40} color="white" />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '14px', color: 'white' }}>
          Deck Review Complete! 🎉
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '1rem', lineHeight: 1.6 }}>
          You reviewed <strong>{sessionReviewed} cards</strong> in <strong>{deck.title}</strong> using the SuperMemo SM-2 spaced repetition algorithm.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={onBack} className="btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Decks</span>
          </button>
          <button onClick={() => { setCurrentIndex(0); setIsFlipped(false); setIsCompleted(false); setSessionReviewed(0); }} className="btn-secondary">
            <RotateCw size={16} />
            <span>Review Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No cards available in this deck.</p>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '18px' }}>
          Back to Decks
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div style={{ maxWidth: '740px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="btn-secondary" style={{ gap: '6px' }}>
          <ArrowLeft size={16} />
          <span>Exit Session</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            Card {currentIndex + 1} of {cards.length}
          </span>
        </div>

        <button onClick={toggleStar} className="btn-secondary" style={{ padding: '8px 14px' }}>
          <Star size={18} color={currentCard.starred ? "#f59e0b" : "var(--text-muted)"} fill={currentCard.starred ? "#f59e0b" : "transparent"} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #a855f7)', transition: 'width 0.3s ease' }} />
      </div>

      {/* 3D Flip Flashcard */}
      <div 
        className={`card-flip-container ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(prev => !prev)}
        style={{ cursor: 'pointer' }}
      >
        <div className="card-flip-inner">
          {/* FRONT */}
          <div className="card-face">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span className="badge badge-cyan">{deck.subject}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click or press Space to Flip</span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, lineHeight: 1.5, color: 'white' }}>
                {currentCard.front}
              </h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSpeak(currentCard.front); }}
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <Volume2 size={16} />
                <span>Listen</span>
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CornerDownLeft size={14} /> Flip Card
              </span>
            </div>
          </div>

          {/* BACK */}
          <div className="card-face card-face-back">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span className="badge badge-violet">Answer & Explanation</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-violet)', fontWeight: 600 }}>SRS Ease: {currentCard.easeFactor}x</span>
              </div>
              <div style={{ fontSize: '1.2rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#f1f5f9' }}>
                {currentCard.back}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSpeak(currentCard.back); }}
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <Volume2 size={16} />
                <span>Listen Answer</span>
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rate recall below (1-4)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SRS Rating Action Buttons (Shown when flipped) */}
      {isFlipped ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <button 
            onClick={() => handleRating(1)} 
            style={{
              padding: '14px 10px',
              borderRadius: '14px',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#f43f5e',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.92rem' }}>1. Again</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>1 day</span>
          </button>

          <button 
            onClick={() => handleRating(2)} 
            style={{
              padding: '14px 10px',
              borderRadius: '14px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.92rem' }}>2. Hard</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>2 days</span>
          </button>

          <button 
            onClick={() => handleRating(3)} 
            style={{
              padding: '14px 10px',
              borderRadius: '14px',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.92rem' }}>3. Good</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>4 days</span>
          </button>

          <button 
            onClick={() => handleRating(4)} 
            style={{
              padding: '14px 10px',
              borderRadius: '14px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.92rem' }}>4. Easy</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>6+ days</span>
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '14px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          💡 Click card or press <strong>Spacebar</strong> to reveal answer
        </div>
      )}
    </div>
  );
}
