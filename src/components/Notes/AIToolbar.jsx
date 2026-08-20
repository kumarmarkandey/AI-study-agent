import React, { useState } from 'react';
import { Sparkles, Brain, Layers, HelpCircle, Lightbulb, Loader2 } from 'lucide-react';
import { summarizeNote, explainFeynman, generateFlashcardDeck, generateQuiz } from '../../services/aiEngine';

export function AIToolbar({ note, apiKey, onCreateDeckFromNote, onCreateQuizFromNote }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [aiOutput, setAiOutput] = useState(null);

  const handleSummarize = async () => {
    setLoadingAction('summarize');
    try {
      const summary = await summarizeNote(note.title, note.content, apiKey);
      setAiOutput({ title: 'AI Summary & Key Insights', content: summary });
    } catch (e) {
      alert('Summarization failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFeynman = async () => {
    setLoadingAction('feynman');
    try {
      const explanation = await explainFeynman(note.title, note.content, apiKey);
      setAiOutput({ title: 'Feynman Concept Analogy', content: explanation });
    } catch (e) {
      alert('Feynman explanation failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConvertToFlashcards = async () => {
    setLoadingAction('cards');
    try {
      const cards = await generateFlashcardDeck(note.title + '\n' + note.content, note.subject || 'General', 4, apiKey);
      const newDeck = {
        id: `deck-note-${Date.now()}`,
        title: `Cards: ${note.title}`,
        subject: note.subject || 'General',
        category: 'From Notes',
        icon: 'Layers',
        color: '#a855f7',
        description: `Generated from note: "${note.title}"`,
        createdAt: new Date().toISOString().split('T')[0],
        cards
      };
      onCreateDeckFromNote(newDeck);
      alert(`Created Flashcard Deck with ${cards.length} cards!`);
    } catch (e) {
      alert('Card generation failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConvertToQuiz = async () => {
    setLoadingAction('quiz');
    try {
      const quiz = await generateQuiz(note.title + '\n' + note.content, note.subject || 'General', 3, apiKey);
      onCreateQuizFromNote(quiz);
      alert('Created Practice Quiz from note!');
    } catch (e) {
      alert('Quiz generation failed');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Action Buttons Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        padding: '12px 18px',
        borderRadius: '14px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)'
      }}>
        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={15} /> AI Assistant Tools:
        </span>

        <button 
          onClick={handleSummarize} 
          disabled={!!loadingAction}
          className="btn-secondary" 
          style={{ padding: '7px 14px', fontSize: '0.82rem' }}
        >
          {loadingAction === 'summarize' ? <Loader2 size={14} className="pulse-active" /> : <Brain size={14} color="#38bdf8" />}
          <span>Summarize Note</span>
        </button>

        <button 
          onClick={handleFeynman} 
          disabled={!!loadingAction}
          className="btn-secondary" 
          style={{ padding: '7px 14px', fontSize: '0.82rem' }}
        >
          {loadingAction === 'feynman' ? <Loader2 size={14} className="pulse-active" /> : <Lightbulb size={14} color="#f59e0b" />}
          <span>Feynman Explainer</span>
        </button>

        <button 
          onClick={handleConvertToFlashcards} 
          disabled={!!loadingAction}
          className="btn-secondary" 
          style={{ padding: '7px 14px', fontSize: '0.82rem' }}
        >
          {loadingAction === 'cards' ? <Loader2 size={14} className="pulse-active" /> : <Layers size={14} color="#a855f7" />}
          <span>Convert to Flashcards</span>
        </button>

        <button 
          onClick={handleConvertToQuiz} 
          disabled={!!loadingAction}
          className="btn-secondary" 
          style={{ padding: '7px 14px', fontSize: '0.82rem' }}
        >
          {loadingAction === 'quiz' ? <Loader2 size={14} className="pulse-active" /> : <HelpCircle size={14} color="#10b981" />}
          <span>Generate Quiz</span>
        </button>
      </div>

      {/* AI Output Result Box */}
      {aiOutput && (
        <div style={{
          padding: '22px',
          borderRadius: '14px',
          background: 'rgba(56, 189, 248, 0.09)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          position: 'relative'
        }}>
          <button 
            onClick={() => setAiOutput(null)} 
            style={{ position: 'absolute', right: '14px', top: '14px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            ×
          </button>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '10px' }}>
            {aiOutput.title}
          </h4>
          <div style={{ fontSize: '0.94rem', lineHeight: 1.65, color: '#f1f5f9', whiteSpace: 'pre-wrap' }}>
            {aiOutput.content}
          </div>
        </div>
      )}
    </div>
  );
}
