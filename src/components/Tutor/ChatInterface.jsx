import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Volume2, 
  Layers, 
  BookOpen, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { PersonaSelector } from './PersonaSelector';
import { askSocraticTutor } from '../../services/aiEngine';

export function ChatInterface({ apiKey, onCreateDeckFromChat, onCreateNoteFromChat }) {
  const [persona, setPersona] = useState('socratic');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      role: 'assistant',
      content: "Hello! I am your Socratic AI Academic Tutor. What topic or problem set would you like to explore today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const responseText = await askSocraticTutor({
        messages: updatedMessages,
        persona,
        apiKey
      });

      const assistantMsg = {
        id: `m-${Date.now() + 1}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      alert('Tutor connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`$]/g, ''));
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: `m-${Date.now()}`,
      role: 'assistant',
      content: "Chat cleared. What shall we learn next?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: 'calc(100vh - 120px)', textAlign: 'left' }}>
      {/* Title & Persona Selector Header */}
      <div className="clunk-card" style={{ padding: '20px 24px', background: '#0e0e14' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
              SOCRATIC DIALOGUE ENGINE
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              SOCRATIC <span style={{ color: 'var(--color-grape-light)' }}>AI TUTOR</span>
            </h2>
          </div>

          <button onClick={handleClearChat} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
            <Trash2 size={14} /> CLEAR CHAT
          </button>
        </div>

        <PersonaSelector activePersona={persona} onSelectPersona={setPersona} />
      </div>

      {/* Main Chat Log Area */}
      <div className="clunk-card" style={{
        flex: 1,
        padding: '28px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: '#0a0a0f'
      }}>
        {messages.map(msg => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '14px',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {!isUser && (
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--color-grape) 0%, var(--color-grape-deep) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 15px var(--color-grape-glow)'
                }}>
                  <Bot size={20} color="white" />
                </div>
              )}

              <div style={{
                padding: '20px 24px',
                borderRadius: '16px',
                background: isUser ? '#ffffff' : '#12121c',
                border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isUser ? '#000000' : '#ffffff',
                lineHeight: 1.65,
                fontSize: '0.94rem',
                borderTopRightRadius: isUser ? '4px' : '16px',
                borderTopLeftRadius: isUser ? '16px' : '4px',
                fontFamily: 'var(--font-sans)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '14px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: isUser ? '#000000' : 'var(--color-grape-light)' }}>
                    {isUser ? 'YOU' : 'SOCRATIC TUTOR'}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: isUser ? 'rgba(0,0,0,0.6)' : 'var(--text-muted)' }}>
                    {msg.timestamp}
                  </span>
                </div>

                <div style={{ whiteSpace: 'pre-wrap', fontWeight: isUser ? 600 : 400 }}>
                  {msg.content}
                </div>

                {/* AI Response Quick Action Toolbar */}
                {!isUser && (
                  <div style={{ display: 'flex', gap: '14px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleSpeak(msg.content)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontWeight: 700 }}
                    >
                      <Volume2 size={14} /> LISTEN
                    </button>
                    <button 
                      onClick={() => onCreateDeckFromChat(msg.content)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-grape-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontWeight: 800 }}
                    >
                      <Layers size={14} /> SAVE AS DECK
                    </button>
                    <button 
                      onClick={() => onCreateNoteFromChat(msg.content)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontWeight: 800 }}
                    >
                      <BookOpen size={14} /> SAVE AS NOTE
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  <User size={20} color="#000000" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(147, 51, 234, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={18} color="var(--color-grape-light)" />
            </div>
            <span>Socratic AI is formulating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="clunk-card" style={{ padding: '12px 18px', display: 'flex', gap: '12px', background: '#0e0e14' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a concept question, request a step-by-step math proof..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'white',
            fontSize: '0.92rem',
            padding: '6px 8px',
            fontFamily: 'var(--font-sans)'
          }}
        />
        <button type="submit" className="btn-liquid clunk-shimmer" disabled={loading || !input.trim()} style={{ padding: '10px 22px', fontSize: '0.78rem' }}>
          <Send size={15} />
          <span>SEND</span>
        </button>
      </form>
    </div>
  );
}
