import React, { useState } from 'react';
import { X, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const [apiKey, setApiKey] = useState(settings?.apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      apiKey: apiKey.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="clunk-card" style={{ width: '100%', maxWidth: '540px', padding: '36px', position: 'relative', background: '#0a0a0f', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-grape) 0%, var(--color-grape-deep) 100%)', boxShadow: '0 0 20px var(--color-grape-glow)' }}>
            <Key size={24} color="white" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>
              SETTINGS & CONFIGURATION
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure Gemini API key for live AI inference</p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: '8px', color: '#ffffff' }}>
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                background: '#050508',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.45 }}>
              💡 If left blank, Clunk Study OS automatically uses its rich <strong>Built-in AI Engine</strong>. All features stay available either way!
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={22} color="#10b981" />
            <span style={{ fontSize: '0.8rem', color: '#34d399', lineHeight: 1.4, fontFamily: 'var(--font-sans)' }}>
              API Keys are stored locally in your browser's private localStorage and are never shared with tracking servers.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              CANCEL
            </button>
            <button type="submit" className="btn-liquid clunk-shimmer">
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>SAVED!</span>
                </>
              ) : (
                <span>SAVE SETTINGS ↗</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
