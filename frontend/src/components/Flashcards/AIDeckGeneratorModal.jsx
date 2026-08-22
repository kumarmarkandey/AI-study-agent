import React, { useState } from 'react';
import { Sparkles, X, Loader2, Layers } from 'lucide-react';
import { generateFlashcardDeck } from '../../services/aiEngine';

export function AIDeckGeneratorModal({ isOpen, onClose, onDeckCreated, apiKey }) {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [cardCount, setCardCount] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const cards = await generateFlashcardDeck(topic, subject, cardCount, apiKey);
      const newDeck = {
        id: `deck-ai-${Date.now()}`,
        title: topic.length > 28 ? `${topic.slice(0, 25)}...` : topic,
        subject,
        category: 'AI Generated',
        color: '#9333ea',
        description: `AI Deck generated on "${topic}" with ${cards.length} SM-2 cards.`,
        createdAt: new Date().toISOString().split('T')[0],
        cards
      };

      onDeckCreated(newDeck);
      setTopic('');
      onClose();
    } catch (err) {
      alert('Failed to generate deck: ' + (err.message || 'Error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="clunk-card" style={{ width: '100%', maxWidth: '540px', padding: '36px', position: 'relative', background: '#0a0a0f', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
        <button
          onClick={onClose}
          disabled={loading}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-grape) 0%, var(--color-grape-deep) 100%)', boxShadow: '0 0 20px var(--color-grape-glow)' }}>
            <Sparkles size={24} color="white" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>
              AI DECK GENERATOR
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generate structured SRS flashcards instantly on any topic</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: '8px', color: '#ffffff' }}>
              Topic or Syllabus Extract
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g., Quantum Entanglement, Backpropagation algorithms, Mitosis stages, or paste lecture notes..."
              required
              rows={4}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                background: '#050508',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.5
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: '8px', color: '#ffffff' }}>
                Subject Domain
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#050508',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: '8px', color: '#ffffff' }}>
                Number of Cards
              </label>
              <select
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#050508',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value={3}>3 Cards (Quick Review)</option>
                <option value={5}>5 Cards (Standard)</option>
                <option value={8}>8 Cards (Deep Dive)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">
              CANCEL
            </button>
            <button type="submit" disabled={loading || !topic.trim()} className="btn-liquid clunk-shimmer">
              {loading ? (
                <>
                  <Loader2 size={16} />
                  <span>SYNTHESIZING...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>GENERATE DECK ↗</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
