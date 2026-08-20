import React, { useState } from 'react';
import { Sparkles, X, Loader2, BookOpen, Layers } from 'lucide-react';
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
        color: subject === 'Physics' ? '#a855f7' : subject === 'Biology' ? '#10b981' : '#38bdf8',
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          disabled={loading}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)', boxShadow: 'var(--shadow-glow-violet)' }}>
            <Sparkles size={24} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>AI Flashcard Generator</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Generate structured SRS flashcards instantly on any subject</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
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
                borderRadius: '12px',
                background: 'rgba(5, 8, 16, 0.85)',
                border: '1px solid var(--border-color)',
                color: 'white',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-main)',
                lineHeight: 1.5
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Subject Domain
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(5, 8, 16, 0.85)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  fontSize: '0.88rem',
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
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Number of Cards
              </label>
              <select
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(5, 8, 16, 0.85)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  fontSize: '0.88rem',
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
              Cancel
            </button>
            <button type="submit" disabled={loading || !topic.trim()} className="btn-violet">
              {loading ? (
                <>
                  <Loader2 size={18} className="pulse-active" />
                  <span>Synthesizing Cards...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Deck</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
