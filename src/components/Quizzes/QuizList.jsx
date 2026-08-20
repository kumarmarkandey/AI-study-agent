import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Clock, 
  History
} from 'lucide-react';
import { QuizGeneratorModal } from './QuizGeneratorModal';

export function QuizList({ quizzes, results, onSelectQuiz, onCreateQuiz, apiKey }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>Practice Exams & Diagnostics</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Test your conceptual knowledge under timed conditions with instant step-by-step explanations.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-emerald">
          <Sparkles size={16} />
          <span>Generate Quiz with AI</span>
        </button>
      </div>

      {/* Available Quizzes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '22px'
      }}>
        {quizzes.map(quiz => (
          <div 
            key={quiz.id} 
            className="glass-panel glass-card-interactive"
            onClick={() => onSelectQuiz(quiz)}
            style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '210px' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge badge-emerald">{quiz.subject}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} /> {quiz.timeLimitMinutes} mins
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
                {quiz.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {quiz.questions.length} Diagnostic Multiple-Choice Questions
              </p>
            </div>

            <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.86rem' }}>
                <Play size={14} />
                <span>Start Quiz</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Past Quiz Diagnostic History */}
      {results.length > 0 && (
        <div className="glass-panel" style={{ padding: '26px', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <History size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Recent Quiz Diagnostic Results</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {results.map(res => (
              <div 
                key={res.id} 
                style={{
                  padding: '18px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: 'white' }}>{res.quizTitle}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Completed {new Date(res.completedAt).toLocaleDateString()} • {res.correctAnswers}/{res.totalQuestions} Correct
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: res.score >= 80 ? '#10b981' : '#f59e0b'
                  }}>
                    {res.score}%
                  </div>
                  <span className={res.score >= 80 ? 'badge badge-emerald' : 'badge badge-amber'}>
                    {res.score >= 80 ? 'Passed' : 'Needs Review'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <QuizGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onQuizCreated={onCreateQuiz}
        apiKey={apiKey}
      />
    </div>
  );
}
