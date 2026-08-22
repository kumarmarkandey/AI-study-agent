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
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
      {/* Title */}
      <div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
          DEEP WORK & AUDIO SYNTH
        </span>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: '8px' }}>
          FOCUS <span style={{ color: 'var(--color-grape-light)' }}>POMODORO</span>
        </h1>
      </div>

      {/* Pomodoro Card */}
      <div className="clunk-card" style={{ padding: '44px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0e0e14' }}>
        {/* Mode Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', background: '#050508', padding: '6px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setMode('focus')}
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              border: 'none',
              background: mode === 'focus' ? '#ffffff' : 'transparent',
              color: mode === 'focus' ? '#000000' : 'rgba(255, 255, 255, 0.65)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Brain size={15} /> FOCUS (25M)
          </button>

          <button
            onClick={() => setMode('short')}
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              border: 'none',
              background: mode === 'short' ? '#ffffff' : 'transparent',
              color: mode === 'short' ? '#000000' : 'rgba(255, 255, 255, 0.65)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Coffee size={15} /> SHORT BREAK (5M)
          </button>

          <button
            onClick={() => setMode('long')}
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              border: 'none',
              background: mode === 'long' ? '#ffffff' : 'transparent',
              color: mode === 'long' ? '#000000' : 'rgba(255, 255, 255, 0.65)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            LONG BREAK (15M)
          </button>
        </div>

        {/* Large Timer Display */}
        <div style={{ position: 'relative', width: '260px', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
          <svg width="260" height="260" viewBox="0 0 260 260" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="130" cy="130" r="110" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="12" fill="transparent" />
            <circle
              cx="130"
              cy="130"
              r="110"
              stroke="var(--color-grape-light)"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            />
          </svg>

          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '3.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', letterSpacing: '-1px', color: 'white' }}>
              {formatTime(timeLeft)}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-grape-light)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {isRunning ? '★ SESSION ACTIVE' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '18px', justifyContent: 'center' }}>
          <button
            onClick={toggleTimer}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: 'none',
              background: isRunning ? '#f43f5e' : '#ffffff',
              color: isRunning ? '#ffffff' : '#000000',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(255, 255, 255, 0.2)',
              transition: 'all 0.25s ease'
            }}
          >
            {isRunning ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
          </button>

          <button
            onClick={resetTimer}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
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

        <div style={{ marginTop: '32px', fontSize: '0.88rem', color: 'var(--color-grape-light)', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          🔥 COMPLETED FOCUS SESSIONS TODAY: {completedSessions}
        </div>
      </div>

      {/* Web Audio Ambient Soundscapes Section */}
      <SoundscapeSynth />
    </div>
  );
}
