import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AnalyticsOverview } from './components/Dashboard/AnalyticsOverview';
import { DeckList } from './components/Flashcards/DeckList';
import { FlashcardViewer } from './components/Flashcards/FlashcardViewer';
import { QuizList } from './components/Quizzes/QuizList';
import { QuizPlayer } from './components/Quizzes/QuizPlayer';
import { NoteList } from './components/Notes/NoteList';
import { NoteEditor } from './components/Notes/NoteEditor';
import { ChatInterface } from './components/Tutor/ChatInterface';
import { PomodoroTimer } from './components/Focus/PomodoroTimer';
import { MindMapCanvas } from './components/KnowledgeGraph/MindMapCanvas';
import { KanbanBoard } from './components/Planner/KanbanBoard';
import { SettingsModal } from './components/Settings/SettingsModal';
import { Footer } from './components/Footer';

import { loadInitialAppData, setStoredData } from './services/storage';

export default function App() {
  const [appData, setAppData] = useState(() => loadInitialAppData());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Detail views state
  const [activeDeck, setActiveDeck] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { decks, notes, quizzes, results, tasks, settings, streak, KEYS } = appData;

  // Persist helpers
  const updateDecks = (newDecks) => {
    setAppData(prev => ({ ...prev, decks: newDecks }));
    setStoredData(KEYS.DECKS, newDecks);
  };

  const updateNotes = (newNotes) => {
    setAppData(prev => ({ ...prev, notes: newNotes }));
    setStoredData(KEYS.NOTES, newNotes);
  };

  const updateQuizzes = (newQuizzes) => {
    setAppData(prev => ({ ...prev, quizzes: newQuizzes }));
    setStoredData(KEYS.QUIZZES, newQuizzes);
  };

  const updateResults = (newResults) => {
    setAppData(prev => ({ ...prev, results: newResults }));
    setStoredData(KEYS.RESULTS, newResults);
  };

  const updateTasks = (newTasks) => {
    setAppData(prev => ({ ...prev, tasks: newTasks }));
    setStoredData(KEYS.TASKS, newTasks);
  };

  const updateSettings = (newSettings) => {
    setAppData(prev => ({ ...prev, settings: newSettings }));
    setStoredData(KEYS.SETTINGS, newSettings);
  };

  // Handlers
  const handleDeckCreated = (newDeck) => {
    updateDecks([newDeck, ...decks]);
  };

  const handleDeckUpdated = (updatedDeck) => {
    const newDecks = decks.map(d => d.id === updatedDeck.id ? updatedDeck : d);
    updateDecks(newDecks);
    setActiveDeck(updatedDeck);
  };

  const handleDeckDeleted = (deckId) => {
    const newDecks = decks.filter(d => d.id !== deckId);
    updateDecks(newDecks);
    if (activeDeck?.id === deckId) setActiveDeck(null);
  };

  const handleNoteSaved = (savedNote) => {
    const exists = notes.some(n => n.id === savedNote.id);
    const newNotes = exists ? notes.map(n => n.id === savedNote.id ? savedNote : n) : [savedNote, ...notes];
    updateNotes(newNotes);
    setActiveNote(savedNote);
  };

  const handleNoteDeleted = (noteId) => {
    const newNotes = notes.filter(n => n.id !== noteId);
    updateNotes(newNotes);
    setActiveNote(null);
  };

  const handleQuizCreated = (newQuiz) => {
    updateQuizzes([newQuiz, ...quizzes]);
  };

  const handleQuizCompleted = (result) => {
    const newResults = [result, ...results];
    updateResults(newResults);
    setActiveQuiz(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveDeck(null);
    setActiveNote(null);
    setActiveQuiz(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cross-module AI creations from Socratic Chat
  const handleCreateDeckFromChat = (content) => {
    const newDeck = {
      id: `deck-chat-${Date.now()}`,
      title: `Deck: ${content.slice(0, 24)}...`,
      subject: 'Computer Science',
      category: 'AI Chat',
      color: '#9333ea',
      description: 'Created from Socratic AI conversation response.',
      createdAt: new Date().toISOString().split('T')[0],
      cards: [
        {
          id: `c-chat-1`,
          front: `Explain the core concept: "${content.slice(0, 40)}..."`,
          back: content,
          interval: 1,
          repetition: 0,
          easeFactor: 2.5,
          dueDate: new Date().toISOString().split('T')[0],
          starred: true,
          mastered: false
        }
      ]
    };
    handleDeckCreated(newDeck);
    alert('Flashcard Deck created from AI response! Switched to AI Flashcards tab.');
    handleTabChange('flashcards');
  };

  const handleCreateNoteFromChat = (content) => {
    const newNote = {
      id: `note-chat-${Date.now()}`,
      title: `Tutor Note: ${content.slice(0, 24)}...`,
      subject: 'Computer Science',
      content: `# Tutor Explanation\n\n${content}`,
      tags: ['Tutor', 'AI'],
      updatedAt: new Date().toISOString()
    };
    handleNoteSaved(newNote);
    alert('Saved AI Response as a Smart Note!');
    handleTabChange('notes');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#050505', color: '#ffffff' }}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        streak={streak}
        apiKey={settings.apiKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      <main 
        className="main-content-container"
        style={{ 
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '32px 28px',
          flex: 1,
          boxSizing: 'border-box'
        }}
      >
        <div key={activeTab} className="tab-fade-in">
          {activeTab === 'dashboard' && (
            <AnalyticsOverview
              decks={decks}
              notes={notes}
              quizzes={quizzes}
              results={results}
              setActiveTab={handleTabChange}
            />
          )}

          {activeTab === 'flashcards' && (
            activeDeck ? (
              <FlashcardViewer
                deck={activeDeck}
                onUpdateDeck={handleDeckUpdated}
                onBack={() => setActiveDeck(null)}
              />
            ) : (
              <DeckList
                decks={decks}
                onSelectDeck={(deck) => setActiveDeck(deck)}
                onCreateDeck={handleDeckCreated}
                onDeleteDeck={handleDeckDeleted}
                apiKey={settings.apiKey}
              />
            )
          )}

          {activeTab === 'quizzes' && (
            activeQuiz ? (
              <QuizPlayer
                quiz={activeQuiz}
                onCompleteQuiz={handleQuizCompleted}
                onBack={() => setActiveQuiz(null)}
              />
            ) : (
              <QuizList
                quizzes={quizzes}
                results={results}
                onSelectQuiz={(quiz) => setActiveQuiz(quiz)}
                onCreateQuiz={handleQuizCreated}
                apiKey={settings.apiKey}
              />
            )
          )}

          {activeTab === 'notes' && (
            activeNote ? (
              <NoteEditor
                note={activeNote}
                onSaveNote={handleNoteSaved}
                onDeleteNote={handleNoteDeleted}
                onBack={() => setActiveNote(null)}
                apiKey={settings.apiKey}
                onCreateDeckFromNote={handleDeckCreated}
                onCreateQuizFromNote={handleQuizCreated}
              />
            ) : (
              <NoteList
                notes={notes}
                onSelectNote={(note) => setActiveNote(note)}
                onCreateNewNote={() => setActiveNote({ title: 'New Study Note', subject: 'Computer Science', content: '', tags: [] })}
              />
            )
          )}

          {activeTab === 'tutor' && (
            <ChatInterface
              apiKey={settings.apiKey}
              onCreateDeckFromChat={handleCreateDeckFromChat}
              onCreateNoteFromChat={handleCreateNoteFromChat}
            />
          )}

          {activeTab === 'focus' && <PomodoroTimer />}

          {activeTab === 'mindmap' && (
            <MindMapCanvas
              decks={decks}
              notes={notes}
              onNavigateToDeck={(deck) => { setActiveDeck(deck); setActiveTab('flashcards'); }}
              onNavigateToNote={(note) => { setActiveNote(note); setActiveTab('notes'); }}
            />
          )}

          {activeTab === 'planner' && (
            <KanbanBoard
              tasks={tasks}
              onSaveTasks={updateTasks}
            />
          )}
        </div>
      </main>

      <Footer onOpenSettings={() => setIsSettingsOpen(true)} setActiveTab={handleTabChange} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={updateSettings}
      />
    </div>
  );
}
