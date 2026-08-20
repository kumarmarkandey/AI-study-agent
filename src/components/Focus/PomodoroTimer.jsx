import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { playTimerCompletionChime } from '../../services/webAudioSynth';
import { SoundscapeSynth } from './SoundscapeSynth';

export function PomodoroTimer() {
  const [mode, setMode] = useState('focus'); // focus (25), short (5), long (15)
  const [durations] = useState({ focus: 25, short: 5, long: 15 });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(2);

  useEffect(() => {
    setTimeLeft(durations[mode] * 60);
    setIsRunning(false);
  }, [mode, durations]);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playTimerCompletionChime();
      if (mode === 'focus') {
        setCompletedSessions(prev => prev + 1);
        alert('🎉 Focus Session Completed! Time for a short break.');
      } else {
        alert('Break completed! Ready to dive back in?');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode] * 60);
  };

  const totalSeconds = durations[mode] * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Pomodoro Card */}
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Mode Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px', borderRadius: '30px', marginBottom: '36px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setMode('focus')}
            style={{
              padding: '10px 22px',
              borderRadius: '20px',
              border: 'none',
              background: mode === 'focus' ? 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)' : 'transparent',
              color: mode === 'focus' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Brain size={16} /> Focus (25m)
          </button>

          <button
            onClick={() => setMode('short')}
            style={{
              padding: '10px 22px',
              borderRadius: '20px',
              border: 'none',
              background: mode === 'short' ? 'linear-gradient(135deg, #059669 0%, #34d399 100%)' : 'transparent',
              color: mode === 'short' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Coffee size={16} /> Short Break (5m)
          </button>

          <button
            onClick={() => setMode('long')}
            style={{
              padding: '10px 22px',
              borderRadius: '20px',
              border: 'none',
              background: mode === 'long' ? 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)' : 'transparent',
              color: mode === 'long' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Large Timer Display */}
        <div style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '36px' }}>
          <svg width="250" height="250" viewBox="0 0 250 250" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="125" cy="125" r="105" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="12" fill="transparent" />
            <circle
              cx="125"
              cy="125"
              r="105"
              stroke={mode === 'focus' ? '#38bdf8' : mode === 'short' ? '#10b981' : '#a855f7'}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 105}
              strokeDashoffset={2 * Math.PI * 105 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            />
          </svg>

          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '3.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '-1px', color: 'white' }}>
              {formatTime(timeLeft)}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              {isRunning ? 'Session Active' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '18px', justifyContent: 'center' }}>
          <button
            onClick={toggleTimer}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: 'none',
              background: isRunning ? '#f43f5e' : 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              cursor: 'pointer',
              boxShadow: isRunning ? '0 0 24px rgba(244, 63, 94, 0.5)' : 'var(--shadow-glow-cyan)',
              transition: 'all 0.25s ease'
            }}
          >
            {isRunning ? <Pause size={26} /> : <Play size={26} style={{ marginLeft: '4px' }} />}
          </button>

          <button
            onClick={resetTimer}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '1px solid var(--border-color)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Reset Timer"
          >
            <RotateCcw size={22} />
          </button>
        </div>

        <div style={{ marginTop: '28px', fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
          🔥 Completed Focus Sessions Today: {completedSessions}
        </div>
      </div>

      {/* Web Audio Ambient Soundscapes Section */}
      <SoundscapeSynth />
    </div>
  );
}
