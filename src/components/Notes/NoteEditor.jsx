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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 'calc(100vh - 120px)' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Notes</span>
        </button>

        {/* Mode Toggles */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px' }}>
          <button 
            onClick={() => setActiveMode('edit')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeMode === 'edit' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: activeMode === 'edit' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Edit Only
          </button>

          <button 
            onClick={() => setActiveMode('split')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeMode === 'split' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: activeMode === 'split' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Split View
          </button>

          <button 
            onClick={() => setActiveMode('preview')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeMode === 'preview' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: activeMode === 'preview' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Preview Only
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {note?.id && (
            <button onClick={() => onDeleteNote(note.id)} className="btn-secondary" style={{ color: '#f43f5e' }}>
              <Trash2 size={16} />
            </button>
          )}
          <button onClick={handleSave} className="btn-primary">
            <Save size={16} />
            <span>Save Note</span>
          </button>
        </div>
      </div>

      {/* Note Title & Metadata Inputs */}
      <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'white',
            width: '100%',
            fontFamily: 'var(--font-heading)'
          }}
        />

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'rgba(5, 8, 16, 0.85)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-cyan)',
              fontSize: '0.84rem',
              fontWeight: 600,
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
                fontSize: '0.84rem',
                color: 'var(--text-secondary)',
                width: '100%',
                fontFamily: 'var(--font-main)'
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
        gap: '18px',
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
              padding: '22px',
              borderRadius: '18px',
              background: 'rgba(15, 23, 42, 0.92)',
              border: '1px solid var(--border-color)',
              color: '#f8fafc',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.65,
              resize: 'none',
              outline: 'none'
            }}
          />
        )}

        {/* Live Preview Pane */}
        {(activeMode === 'preview' || activeMode === 'split') && (
          <div className="glass-panel" style={{
            padding: '26px',
            overflowY: 'auto',
            height: '100%',
            minHeight: '400px',
            lineHeight: 1.7,
            color: '#e2e8f0',
            fontSize: '0.95rem'
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
