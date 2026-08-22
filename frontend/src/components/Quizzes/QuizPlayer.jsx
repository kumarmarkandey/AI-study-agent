import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function QuizPlayer({ quiz, onCompleteQuiz, onBack }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [hints, setHints] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitMinutes * 60);

  const currentQ = quiz.questions[currentQIndex];

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQIndex]: optionIndex
    }));
    setShowExplanation(prev => ({
      ...prev,
      [currentQIndex]: true
    }));
  };

  const handleGetHint = () => {
    setHints(prev => ({
      ...prev,
      [currentQIndex]: `💡 Hint: Focus on core principle definitions. Eliminate options that contradict basic domain rules!`
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);

    const result = {
      id: `res-${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      score: scorePercentage,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      completedAt: new Date().toISOString(),
      weakAreas: scorePercentage < 100 ? ['Hyperparameters & Optimization'] : [],
      recommendation: scorePercentage >= 80 ? 'Excellent performance! Maintain periodic SRS reviews.' : 'Review relevant notes and test again.'
    };

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    onCompleteQuiz(result);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', textAlign: 'left' }}>
      {/* Quiz Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="btn-secondary" style={{ gap: '8px' }}>
          <ArrowLeft size={16} />
          <span>EXIT PRACTICE</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '9999px', background: 'rgba(147, 51, 234, 0.18)', border: '1px solid var(--color-grape-light)', color: 'var(--color-grape-light)', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <Clock size={16} />
          <span>TIME REMAINING: {formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="clunk-card" style={{ padding: '40px', background: '#0e0e14' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <span className="badge badge-grape">QUESTION {currentQIndex + 1} OF {quiz.questions.length}</span>
          <span className="badge badge-white">{quiz.subject}</span>
        </div>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '30px', lineHeight: 1.5, color: 'white', fontFamily: 'var(--font-display)' }}>
          {currentQ.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQIndex] === idx;
            const isSubmitted = showExplanation[currentQIndex];
            const isCorrect = currentQ.correctAnswerIndex === idx;

            let bgColor = 'rgba(255, 255, 255, 0.03)';
            let borderColor = 'rgba(255, 255, 255, 0.14)';
            let textColor = 'var(--text-primary)';

            if (isSubmitted) {
              if (isCorrect) {
                bgColor = 'rgba(16, 185, 129, 0.16)';
                borderColor = '#10b981';
                textColor = '#34d399';
              } else if (isSelected) {
                bgColor = 'rgba(244, 63, 94, 0.16)';
                borderColor = '#f43f5e';
                textColor = '#f43f5e';
              }
            } else if (isSelected) {
              bgColor = 'rgba(147, 51, 234, 0.2)';
              borderColor = 'var(--color-grape-light)';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '18px 24px',
                  borderRadius: '12px',
                  border: `1px solid ${borderColor}`,
                  background: bgColor,
                  color: textColor,
                  fontSize: '0.98rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  lineHeight: 1.5,
                  fontFamily: 'var(--font-sans)'
                }}
              >
                <span>{String.fromCharCode(65 + idx)}. {option}</span>
                {isSubmitted && isCorrect && <CheckCircle2 size={20} color="#10b981" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle size={20} color="#f43f5e" />}
              </button>
            );
          })}
        </div>

        {/* AI Hint Section */}
        {hints[currentQIndex] && (
          <div style={{ marginTop: '26px', padding: '20px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#f59e0b', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {hints[currentQIndex]}
          </div>
        )}

        {/* Step-by-Step Explanation */}
        {showExplanation[currentQIndex] && (
          <div style={{ marginTop: '26px', padding: '24px', borderRadius: '12px', background: 'rgba(147, 51, 234, 0.15)', border: '1px solid rgba(147, 51, 234, 0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-grape-light)', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: '10px' }}>
              <Sparkles size={16} />
              <span>EXPLANATION & CONCEPT NOTES</span>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#e2e8f0' }}>
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button onClick={handleGetHint} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.8rem' }}>
            <Lightbulb size={16} color="#f59e0b" />
            <span>AI HINT</span>
          </button>

          <div style={{ display: 'flex', gap: '14px' }}>
            {currentQIndex + 1 < quiz.questions.length ? (
              <button 
                onClick={() => setCurrentQIndex(prev => prev + 1)} 
                className="btn-liquid clunk-shimmer"
              >
                <span>NEXT QUESTION</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmitQuiz} className="btn-liquid clunk-shimmer">
                <CheckCircle2 size={16} />
                <span>SUBMIT PRACTICE QUIZ ↗</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
