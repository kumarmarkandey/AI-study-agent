import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Zap, Radio, Wind, Play, Square } from 'lucide-react';
import { playSoundscape, stopSoundscape } from '../../services/webAudioSynth';

export function SoundscapeSynth() {
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.5);

  const soundscapes = [
    { id: 'rain', name: 'Rain & Thunder', icon: CloudRain, color: '#38bdf8', desc: 'Soothing pink noise rain simulation' },
    { id: 'alpha', name: 'Alpha Focus Beats', icon: Zap, color: '#f59e0b', desc: '10Hz binaural beat for deep cognitive focus' },
    { id: 'drone', name: 'Cosmic Deep Space', icon: Radio, color: 'var(--color-grape-light)', desc: 'Resonant harmonic drone space ambient' },
    { id: 'whitenoise', name: 'Soft White Noise', icon: Wind, color: '#10b981', desc: 'Blocks out background room distractions' },
  ];

  const handleToggle = (id) => {
    if (activeSound === id) {
      stopSoundscape();
      setActiveSound(null);
    } else {
      playSoundscape(id, volume);
      setActiveSound(id);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (activeSound) {
      playSoundscape(activeSound, val);
    }
  };

  return (
    <div className="clunk-card" style={{ padding: '32px', background: '#0a0a0f', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>
            WEB AUDIO AMBIENT SYNTHESIZER
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pure procedural synthesis (100% offline, zero external MP3 dependencies)</p>
        </div>

        {/* Volume Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {volume === 0 ? <VolumeX size={18} color="var(--text-muted)" /> : <Volume2 size={18} color="var(--color-grape-light)" />}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: '110px', accentColor: 'var(--color-grape-light)', cursor: 'pointer' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
        {soundscapes.map(s => {
          const Icon = s.icon;
          const isPlayingThis = activeSound === s.id;

          return (
            <button
              key={s.id}
              onClick={() => handleToggle(s.id)}
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: isPlayingThis ? `1px solid ${s.color}` : '1px solid rgba(255, 255, 255, 0.12)',
                background: isPlayingThis ? 'rgba(147, 51, 234, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: isPlayingThis ? `0 0 24px rgba(147, 51, 234, 0.4)` : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: `${s.color}20`, color: s.color }}>
                  <Icon size={20} />
                </div>
                <div style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  background: isPlayingThis ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                  color: isPlayingThis ? '#000000' : 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {isPlayingThis ? <Square size={10} fill="#000000" /> : <Play size={10} fill="currentColor" />}
                  <span>{isPlayingThis ? 'STOP' : 'PLAY'}</span>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>{s.name}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.35 }}>{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
