import { INITIAL_DECKS } from '../data/sampleDecks';
import { INITIAL_NOTES } from '../data/sampleNotes';
import { INITIAL_QUIZZES, INITIAL_QUIZ_RESULTS } from '../data/sampleQuizzes';
import { INITIAL_TASKS } from '../data/sampleTasks';

const KEYS = {
  DECKS: 'omnistudy_decks',
  NOTES: 'omnistudy_notes',
  QUIZZES: 'omnistudy_quizzes',
  RESULTS: 'omnistudy_results',
  TASKS: 'omnistudy_tasks',
  SETTINGS: 'omnistudy_settings',
  FOCUS_SESSIONS: 'omnistudy_focus_sessions',
  STREAK: 'omnistudy_streak'
};

export function getStoredData(key, fallbackData) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackData;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage:`, e);
    return fallbackData;
  }
}

export function setStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

export function loadInitialAppData() {
  const decks = getStoredData(KEYS.DECKS, INITIAL_DECKS);
  const notes = getStoredData(KEYS.NOTES, INITIAL_NOTES);
  const quizzes = getStoredData(KEYS.QUIZZES, INITIAL_QUIZZES);
  const results = getStoredData(KEYS.RESULTS, INITIAL_QUIZ_RESULTS);
  const tasks = getStoredData(KEYS.TASKS, INITIAL_TASKS);
  const settings = getStoredData(KEYS.SETTINGS, { apiKey: '', theme: 'dark', socraticPersona: 'socratic', pomodoroTime: 25, shortBreakTime: 5, longBreakTime: 15 });
  const streak = getStoredData(KEYS.STREAK, { currentStreak: 5, lastActiveDate: new Date().toISOString().split('T')[0], totalHours: 14.5 });

  return { decks, notes, quizzes, results, tasks, settings, streak, KEYS };
}
