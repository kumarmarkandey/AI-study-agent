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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          disabled={loading}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', boxShadow: 'var(--shadow-glow-emerald)' }}>
            <HelpCircle size={24} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>AI Quiz Generator</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Generate diagnostic multiple-choice exams on demand</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
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
                Questions Count
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
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
                <option value={3}>3 Questions (Quick Diagnostic)</option>
                <option value={5}>5 Questions (Standard Practice)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading || !topic.trim()} className="btn-emerald">
              {loading ? (
                <>
                  <Loader2 size={18} className="pulse-active" />
                  <span>Synthesizing Exam...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Quiz</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
