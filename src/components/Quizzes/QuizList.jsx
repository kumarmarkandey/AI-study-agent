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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', textAlign: 'left' }}>
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
            DIAGNOSTIC TESTING ENGINE
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: '8px' }}>
            PRACTICE <span style={{ color: 'var(--color-grape-light)' }}>QUIZZES</span>
          </h1>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-liquid clunk-shimmer">
          <Sparkles size={16} />
          <span>GENERATE QUIZ WITH AI ↗</span>
          <span className="clunk-shimmer-sweep" />
        </button>
      </div>

      {/* Available Quizzes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '32px'
      }}>
        {quizzes.map(quiz => (
          <div 
            key={quiz.id} 
            className="clunk-card"
            onClick={() => onSelectQuiz(quiz)}
            style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '250px', cursor: 'pointer' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span className="badge badge-grape">{quiz.subject}</span>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} /> {quiz.timeLimitMinutes} MINS
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', color: 'white', fontFamily: 'var(--font-display)' }}>
                {quiz.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {quiz.questions.length} Diagnostic Multiple-Choice Questions
              </p>
            </div>

            <div style={{ marginTop: '26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.78rem' }}>
                <Play size={14} />
                <span>START QUIZ ↗</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Past Quiz Diagnostic History */}
      {results.length > 0 && (
        <div className="clunk-card" style={{ padding: '32px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <History size={20} color="var(--color-grape-light)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>
              RECENT DIAGNOSTIC RESULTS
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.map(res => (
              <div 
                key={res.id} 
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', color: 'white', fontFamily: 'var(--font-display)' }}>
                    {res.quizTitle}
                  </h4>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    COMPLETED {new Date(res.completedAt).toLocaleDateString()} • {res.correctAnswers}/{res.totalQuestions} CORRECT
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-display)',
                    color: res.score >= 80 ? '#10b981' : 'var(--color-grape-light)'
                  }}>
                    {res.score}%
                  </div>
                  <span className={res.score >= 80 ? 'badge badge-emerald' : 'badge badge-grape'}>
                    {res.score >= 80 ? 'PASSED' : 'NEEDS REVIEW'}
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
