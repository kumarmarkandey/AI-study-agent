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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)', boxShadow: 'var(--shadow-glow-cyan)' }}>
            <Key size={24} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>Settings & AI Configuration</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Configure Gemini API key for live inference</p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
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
                borderRadius: '12px',
                background: 'rgba(5, 8, 16, 0.85)',
                border: '1px solid var(--border-color)',
                color: 'white',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.45 }}>
              💡 If left blank, OmniStudy AI will automatically use its rich <strong>Built-in AI Fallback Engine</strong>. All features work seamlessly either way!
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={22} color="#10b981" />
            <span style={{ fontSize: '0.82rem', color: '#34d399', lineHeight: 1.4 }}>
              API Keys are stored locally in your browser's private localStorage and are never sent to third-party tracking servers.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
