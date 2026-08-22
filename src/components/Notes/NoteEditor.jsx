import React, { useState } from 'react';
import { ArrowLeft, Save, Trash2, Tag } from 'lucide-react';
import { AIToolbar } from './AIToolbar';

export function NoteEditor({ note, onSaveNote, onDeleteNote, onBack, apiKey, onCreateDeckFromNote, onCreateQuizFromNote }) {
  const [title, setTitle] = useState(note?.title || 'Untitled Note');
  const [subject, setSubject] = useState(note?.subject || 'Computer Science');
  const [content, setContent] = useState(note?.content || '');
  const [tagInput, setTagInput] = useState(note?.tags ? note.tags.join(', ') : '');
  const [activeMode, setActiveMode] = useState('split'); // split, edit, preview

  const handleSave = () => {
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    const updatedNote = {
      ...note,
      id: note?.id || `note-${Date.now()}`,
      title,
      subject,
      content,
      tags,
      updatedAt: new Date().toISOString()
    };
    onSaveNote(updatedNote);
    alert('Note saved successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: 'calc(100vh - 120px)', textAlign: 'left' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={onBack} className="btn-secondary" style={{ gap: '8px' }}>
          <ArrowLeft size={16} />
          <span>BACK TO NOTES</span>
        </button>

        {/* Mode Toggles */}
        <div style={{ display: 'flex', gap: '4px', background: '#0a0a0f', padding: '4px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <button 
            onClick={() => setActiveMode('edit')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: activeMode === 'edit' ? '#ffffff' : 'transparent',
              color: activeMode === 'edit' ? '#000000' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            EDIT ONLY
          </button>

          <button 
            onClick={() => setActiveMode('split')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: activeMode === 'split' ? '#ffffff' : 'transparent',
              color: activeMode === 'split' ? '#000000' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            SPLIT VIEW
          </button>

          <button 
            onClick={() => setActiveMode('preview')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: activeMode === 'preview' ? '#ffffff' : 'transparent',
              color: activeMode === 'preview' ? '#000000' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            PREVIEW ONLY
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {note?.id && (
            <button onClick={() => onDeleteNote(note.id)} className="btn-secondary" style={{ color: '#f43f5e' }}>
              <Trash2 size={16} />
            </button>
          )}
          <button onClick={handleSave} className="btn-liquid clunk-shimmer">
            <Save size={16} />
            <span>SAVE NOTE ↗</span>
          </button>
        </div>
      </div>

      {/* Note Title & Metadata Inputs */}
      <div className="clunk-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#0e0e14' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '1.6rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'white',
            width: '100%',
            fontFamily: 'var(--font-display)'
          }}
        />

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#050508',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'var(--color-grape-light)',
              fontSize: '0.82rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              outline: 'none'
            }}
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Physics">Physics</option>
            <option value="Biology">Biology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
            <option value="History">History</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <Tag size={15} color="var(--text-muted)" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Tags separated by comma (e.g. AI, Transformers, Math)..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                width: '100%',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Assistant Bar */}
      <AIToolbar
        note={{ title, subject, content }}
        apiKey={apiKey}
        onCreateDeckFromNote={onCreateDeckFromNote}
        onCreateQuizFromNote={onCreateQuizFromNote}
      />

      {/* Main Workspace (Split / Edit / Preview) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeMode === 'split' ? '1fr 1fr' : '1fr',
        gap: '20px',
        flex: 1,
        minHeight: '450px'
      }}>
        {/* Editor Pane */}
        {(activeMode === 'edit' || activeMode === 'split') && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write Markdown here... Use # Headers, **bold**, $e=mc^2$ LaTeX math, ```python code``` blocks..."
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              padding: '24px',
              borderRadius: '16px',
              background: '#09090d',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.65,
              resize: 'none',
              outline: 'none'
            }}
          />
        )}

        {/* Live Preview Pane */}
        {(activeMode === 'preview' || activeMode === 'split') && (
          <div className="clunk-card" style={{
            padding: '28px',
            overflowY: 'auto',
            height: '100%',
            minHeight: '400px',
            lineHeight: 1.7,
            color: '#e2e8f0',
            fontSize: '0.95rem',
            background: '#0e0e14'
          }}>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {content || <span style={{ color: 'var(--text-muted)' }}>Preview will appear here...</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
