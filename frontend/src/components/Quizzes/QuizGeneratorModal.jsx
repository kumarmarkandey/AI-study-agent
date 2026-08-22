import React, { useState } from 'react';
import { Sparkles, X, Loader2, HelpCircle } from 'lucide-react';
import { generateQuiz } from '../../services/aiEngine';

export function QuizGeneratorModal({ isOpen, onClose, onQuizCreated, apiKey }) {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [questionCount, setQuestionCount] = useState(3);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const newQuiz = await generateQuiz(topic, subject, questionCount, apiKey);
      onQuizCreated(newQuiz);
      setTopic('');
      onClose();
    } catch (err) {
      alert('Failed to generate quiz: ' + (err.message || 'Error occurred'));
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
            <HelpCircle size={24} color="white" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>
              AI QUIZ GENERATOR
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generate diagnostic multiple-choice exams on demand</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: '8px', color: '#ffffff' }}>
              Exam Topic or Concept Summary
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g. Convolutional Neural Networks, Thermodynamics Laws, DNA Replication mechanisms..."
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
                Questions Count
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
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
                <option value={3}>3 Questions (Quick Diagnostic)</option>
                <option value={5}>5 Questions (Standard Practice)</option>
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
                  <span>GENERATE QUIZ ↗</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
