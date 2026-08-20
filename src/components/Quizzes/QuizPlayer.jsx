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
      [currentQIndex]: `💡 Hint: Focus on the fundamental formula or concept definition. Eliminate options that contradict core assumptions!`
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
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Quiz Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft size={18} />
          <span>Exit Practice</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '24px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#f59e0b', fontWeight: 700, fontSize: '0.92rem' }}>
          <Clock size={18} />
          <span>Time Remaining: {formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <span className="badge badge-cyan">Question {currentQIndex + 1} of {quiz.questions.length}</span>
          <span className="badge badge-violet">{quiz.subject}</span>
        </div>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '30px', lineHeight: 1.55, color: 'white' }}>
          {currentQ.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQIndex] === idx;
            const isSubmitted = showExplanation[currentQIndex];
            const isCorrect = currentQ.correctAnswerIndex === idx;

            let bgColor = 'rgba(255, 255, 255, 0.04)';
            let borderColor = 'var(--border-color)';
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
              bgColor = 'rgba(56, 189, 248, 0.16)';
              borderColor = '#38bdf8';
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
                  borderRadius: '16px',
                  border: `1px solid ${borderColor}`,
                  background: bgColor,
                  color: textColor,
                  fontSize: '1.02rem',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  lineHeight: 1.5
                }}
              >
                <span>{String.fromCharCode(65 + idx)}. {option}</span>
                {isSubmitted && isCorrect && <CheckCircle2 size={22} color="#10b981" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle size={22} color="#f43f5e" />}
              </button>
            );
          })}
        </div>

        {/* AI Hint Section */}
        {hints[currentQIndex] && (
          <div style={{ marginTop: '26px', padding: '20px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#f59e0b', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {hints[currentQIndex]}
          </div>
        )}

        {/* Instant Step-by-Step Explanation */}
        {showExplanation[currentQIndex] && (
          <div style={{ marginTop: '26px', padding: '24px', borderRadius: '16px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-violet)', fontWeight: 700, marginBottom: '10px' }}>
              <Sparkles size={18} />
              <span>Explanation & Concept Notes</span>
            </div>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.65, color: '#e2e8f0' }}>
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleGetHint} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
            <Lightbulb size={18} color="#f59e0b" />
            <span>AI Hint</span>
          </button>

          <div style={{ display: 'flex', gap: '14px' }}>
            {currentQIndex + 1 < quiz.questions.length ? (
              <button 
                onClick={() => setCurrentQIndex(prev => prev + 1)} 
                className="btn-primary"
              >
                <span>Next Question</span>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={handleSubmitQuiz} className="btn-emerald">
                <CheckCircle2 size={18} />
                <span>Submit Practice Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
