import React, { useState } from 'react';
import { Plus, Search, Clock, ArrowUpRight } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
            KNOWLEDGE BASE & NOTES
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: '8px' }}>
            SMART STUDY <span style={{ color: 'var(--color-grape-light)' }}>NOTES</span>
          </h1>
        </div>

        <button onClick={onCreateNewNote} className="btn-liquid clunk-shimmer">
          <Plus size={16} />
          <span>NEW SMART NOTE ↗</span>
          <span className="clunk-shimmer-sweep" />
        </button>
      </div>

      {/* Search & Subject Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#0a0a0f',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '12px 18px',
          borderRadius: '9999px',
          flex: 1,
          maxWidth: '520px'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH NOTES, FORMULAS, LATEX..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              width: '100%',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {subjects.map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: selectedSubject === subj ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.18)',
                background: selectedSubject === subj ? '#ffffff' : 'transparent',
                color: selectedSubject === subj ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '28px'
      }}>
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="clunk-card"
            onClick={() => onSelectNote(note)}
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              minHeight: '240px',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge badge-grape">{note.subject || 'GENERAL'}</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: 'white', fontFamily: 'var(--font-display)' }}>
                {note.title}
              </h3>
              
              <p style={{
                fontSize: '0.85rem',
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {note.tags && note.tags.map((tag, idx) => (
                  <span key={idx} style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
              <ArrowUpRight size={16} color="var(--color-grape-light)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
