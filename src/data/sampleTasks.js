export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Review Machine Learning Backpropagation Math',
    subject: 'Computer Science',
    status: 'todo', // todo, in_progress, done
    priority: 'high', // high, medium, low
    dueDate: '2026-08-15',
    estimatedMinutes: 45,
    subtasks: [
      { id: 'st1', text: 'Derive partial derivatives for 2-layer MLP', completed: true },
      { id: 'st2', text: 'Review cross-entropy loss gradient', completed: false },
      { id: 'st3', text: 'Solve practice backprop calculation deck', completed: false }
    ]
  },
  {
    id: 'task-2',
    title: 'Complete Thermodynamics Carnot Problem Set',
    subject: 'Physics',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-08-16',
    estimatedMinutes: 60,
    subtasks: [
      { id: 'st4', text: 'Read Chapter 4 in Thermodynamics Textbook', completed: true },
      { id: 'st5', text: 'Calculate efficiency for 4 heat engine setups', completed: true },
      { id: 'st6', text: 'Generate AI quiz check for Carnot Cycle', completed: false }
    ]
  },
  {
    id: 'task-3',
    title: 'Biology Molecular Pathway Diagram',
    subject: 'Biology',
    status: 'done',
    priority: 'low',
    dueDate: '2026-08-12',
    estimatedMinutes: 30,
    subtasks: [
      { id: 'st7', text: 'Sketch Glycolysis 10-step enzyme flowchart', completed: true },
      { id: 'st8', text: 'Create SRS flashcards for enzymes', completed: true }
    ]
  }
];
