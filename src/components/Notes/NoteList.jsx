import React, { useState } from 'react';
import { Plus, Search, Clock } from 'lucide-react';

export function NoteList({ notes, onSelectNote, onCreateNewNote }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const subjects = ['All', 'Computer Science', 'Physics', 'Biology'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search and Filters Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '520px' }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            padding: '10px 16px',
            borderRadius: '12px',
            flex: 1
          }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, formulas, code snippets..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '0.92rem',
                width: '100%',
                fontFamily: 'var(--font-main)'
              }}
            />
          </div>
        </div>

        <button onClick={onCreateNewNote} className="btn-primary">
          <Plus size={16} />
          <span>New Smart Note</span>
        </button>
      </div>

      {/* Subject Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {subjects.map(subj => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              border: selectedSubject === subj ? '1px solid var(--accent-violet)' : '1px solid var(--border-color)',
              background: selectedSubject === subj ? 'rgba(168, 85, 247, 0.16)' : 'transparent',
              color: selectedSubject === subj ? 'var(--accent-violet)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '22px'
      }}>
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="glass-panel glass-card-interactive"
            onClick={() => onSelectNote(note)}
            style={{
              padding: '26px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              minHeight: '230px'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge badge-violet">{note.subject || 'General'}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
                {note.title}
              </h3>
              
              <p style={{
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '18px'
              }}>
                {note.content.replace(/[#*`$]/g, '')}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
              {note.tags && note.tags.map((tag, idx) => (
                <span key={idx} style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-muted)', fontWeight: 500 }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
