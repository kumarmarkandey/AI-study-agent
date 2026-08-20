import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Zap, Radio, Wind, Play, Square } from 'lucide-react';
import { playSoundscape, stopSoundscape } from '../../services/webAudioSynth';

export function SoundscapeSynth() {
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.5);

  const soundscapes = [
    { id: 'rain', name: 'Rain & Thunder', icon: CloudRain, color: '#38bdf8', desc: 'Soothing pink noise rain simulation' },
    { id: 'alpha', name: 'Alpha Focus Beats', icon: Zap, color: '#f59e0b', desc: '10Hz binaural beat for deep cognitive focus' },
    { id: 'drone', name: 'Cosmic Deep Space', icon: Radio, color: '#a855f7', desc: 'Resonant harmonic drone space ambient' },
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
    <div className="glass-panel" style={{ padding: '26px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>Web Audio Ambient Soundscapes</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Pure procedural synthesis (100% offline, zero external audio MP3 dependencies)</p>
        </div>

        {/* Volume Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {volume === 0 ? <VolumeX size={18} color="var(--text-muted)" /> : <Volume2 size={18} color="var(--accent-cyan)" />}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: '110px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        {soundscapes.map(s => {
          const Icon = s.icon;
          const isPlayingThis = activeSound === s.id;

          return (
            <button
              key={s.id}
              onClick={() => handleToggle(s.id)}
              style={{
                padding: '18px',
                borderRadius: '14px',
                border: isPlayingThis ? `1px solid ${s.color}` : '1px solid var(--border-color)',
                background: isPlayingThis ? `${s.color}20` : 'rgba(255, 255, 255, 0.03)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: isPlayingThis ? `0 0 24px ${s.color}35` : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: `${s.color}20`, color: s.color }}>
                  <Icon size={20} />
                </div>
                <div style={{
                  padding: '5px 12px',
                  borderRadius: '14px',
                  background: isPlayingThis ? s.color : 'rgba(255, 255, 255, 0.08)',
                  color: isPlayingThis ? 'white' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {isPlayingThis ? <Square size={10} fill="white" /> : <Play size={10} fill="currentColor" />}
                  <span>{isPlayingThis ? 'Stop' : 'Play'}</span>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'white' }}>{s.name}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.35 }}>{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
