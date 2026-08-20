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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white' }}>Practice Exams & Diagnostics</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Test your conceptual knowledge under timed conditions with instant step-by-step explanations.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-emerald">
          <Sparkles size={18} />
          <span>Generate Quiz with AI</span>
        </button>
      </div>

      {/* Available Quizzes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '28px'
      }}>
        {quizzes.map(quiz => (
          <div 
            key={quiz.id} 
            className="glass-panel glass-card-interactive"
            onClick={() => onSelectQuiz(quiz)}
            style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '230px' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span className="badge badge-emerald">{quiz.subject}</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} /> {quiz.timeLimitMinutes} mins
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: 'white' }}>
                {quiz.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {quiz.questions.length} Diagnostic Multiple-Choice Questions
              </p>
            </div>

            <div style={{ marginTop: '26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.88rem' }}>
                <Play size={15} />
                <span>Start Quiz</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Past Quiz Diagnostic History */}
      {results.length > 0 && (
        <div className="glass-panel" style={{ padding: '30px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <History size={22} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>Recent Quiz Diagnostic Results</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.map(res => (
              <div 
                key={res.id} 
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: 'white' }}>{res.quizTitle}</h4>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Completed {new Date(res.completedAt).toLocaleDateString()} • {res.correctAnswers}/{res.totalQuestions} Correct
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    fontSize: '1.5rem',
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
