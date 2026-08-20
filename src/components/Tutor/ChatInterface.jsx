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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>
      {/* Top Persona Selection */}
      <div className="glass-panel" style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Select AI Tutor Mode:
          </span>
          <button onClick={handleClearChat} className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>
            <Trash2 size={14} /> Clear Chat
          </button>
        </div>
        <PersonaSelector activePersona={persona} onSelectPersona={setPersona} />
      </div>

      {/* Main Chat Log Area */}
      <div className="glass-panel" style={{
        flex: 1,
        padding: '26px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
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
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-glow-cyan)'
                }}>
                  <Bot size={22} color="white" />
                </div>
              )}

              <div style={{
                padding: '18px 22px',
                borderRadius: '18px',
                background: isUser ? 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)' : 'rgba(255, 255, 255, 0.05)',
                border: isUser ? 'none' : '1px solid var(--border-color)',
                color: '#f8fafc',
                lineHeight: 1.65,
                fontSize: '0.95rem',
                borderTopRightRadius: isUser ? '4px' : '18px',
                borderTopLeftRadius: isUser ? '18px' : '4px',
                boxShadow: isUser ? '0 4px 16px rgba(2, 132, 199, 0.3)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '14px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isUser ? 'rgba(255, 255, 255, 0.88)' : 'var(--accent-cyan)' }}>
                    {isUser ? 'You' : 'Socratic Tutor'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: isUser ? 'rgba(255, 255, 255, 0.65)' : 'var(--text-muted)' }}>
                    {msg.timestamp}
                  </span>
                </div>

                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>

                {/* AI Response Quick Action Toolbar */}
                {!isUser && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleSpeak(msg.content)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
                    >
                      <Volume2 size={14} /> Listen
                    </button>
                    <button 
                      onClick={() => onCreateDeckFromChat(msg.content)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      <Layers size={14} /> Save as Deck
                    </button>
                    <button 
                      onClick={() => onCreateNoteFromChat(msg.content)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-violet)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      <BookOpen size={14} /> Save as Note
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  flexShrink: 0
                }}>
                  <User size={22} color="white" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={20} className="pulse-active" color="var(--accent-cyan)" />
            </div>
            <span>Socratic AI is formulating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="glass-panel" style={{ padding: '14px 18px', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a concept question, request a step-by-step math proof, or test your knowledge..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'white',
            fontSize: '0.95rem',
            padding: '6px 8px',
            fontFamily: 'var(--font-main)'
          }}
        />
        <button type="submit" className="btn-primary" disabled={loading || !input.trim()}>
          <Send size={16} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
