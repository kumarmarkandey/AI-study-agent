import React, { useState } from 'react';
import { Plus, Calendar, Trash2 } from 'lucide-react';

export function KanbanBoard({ tasks, onSaveTasks }) {
  const [taskList, setTaskList] = useState(tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Computer Science');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [isAdding, setIsAdding] = useState(false);

  const columns = [
    { id: 'todo', label: 'To Do', color: '#ffffff' },
    { id: 'in_progress', label: 'In Progress', color: 'var(--color-grape-light)' },
    { id: 'done', label: 'Completed', color: '#10b981' }
  ];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      subject: newTaskSubject,
      status: 'todo',
      priority: newTaskPriority,
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      estimatedMinutes: 45,
      subtasks: [
        { id: `st-${Date.now()}-1`, text: 'Initial topic review', completed: false },
        { id: `st-${Date.now()}-2`, text: 'Complete practice questions', completed: false }
      ]
    };

    const updated = [...taskList, newTask];
    setTaskList(updated);
    onSaveTasks(updated);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    const updated = taskList.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
      };
    });
    setTaskList(updated);
    onSaveTasks(updated);
  };

  const handleMoveStatus = (taskId, newStatus) => {
    const updated = taskList.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTaskList(updated);
    onSaveTasks(updated);
  };

  const handleDeleteTask = (taskId) => {
    const updated = taskList.filter(t => t.id !== taskId);
    setTaskList(updated);
    onSaveTasks(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
            WORKFLOW & DEADLINES
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: '8px' }}>
            STUDY TASK <span style={{ color: 'var(--color-grape-light)' }}>PLANNER</span>
          </h1>
        </div>

        <button onClick={() => setIsAdding(true)} className="btn-liquid clunk-shimmer">
          <Plus size={16} />
          <span>ADD STUDY TASK ↗</span>
          <span className="clunk-shimmer-sweep" />
        </button>
      </div>

      {/* Add Task Form Inline */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="clunk-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#0e0e14' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>NEW STUDY TASK</h4>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title (e.g. Prepare for Physics Final Exam)..."
            required
            style={{ padding: '14px', borderRadius: '8px', background: '#050508', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <select
              value={newTaskSubject}
              onChange={(e) => setNewTaskSubject(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', background: '#050508', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', outline: 'none', fontSize: '0.85rem' }}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
              <option value="Biology">Biology</option>
            </select>

            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', background: '#050508', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', outline: 'none', fontSize: '0.85rem' }}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>CANCEL</button>
            <button type="submit" className="btn-liquid clunk-shimmer">SAVE TASK</button>
          </div>
        </form>
      )}

      {/* Kanban Columns */}
      <div className="kanban-board-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {columns.map(col => {
          const colTasks = taskList.filter(t => t.status === col.id);

          return (
            <div key={col.id} className="clunk-card" style={{ padding: '24px', minHeight: '440px', display: 'flex', flexDirection: 'column', gap: '18px', background: '#0a0a0f' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: `2px solid ${col.color}` }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase', color: col.color, fontFamily: 'var(--font-display)' }}>{col.label}</h4>
                <span className="badge badge-grape">{colTasks.length}</span>
              </div>

              {colTasks.map(task => (
                <div key={task.id} style={{ padding: '20px', borderRadius: '12px', background: '#12121c', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-grape" style={{ fontSize: '0.68rem' }}>{task.subject}</span>
                    <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h5 style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>{task.title}</h5>

                  {/* Subtask List */}
                  {task.subtasks && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '4px 0' }}>
                      {task.subtasks.map(st => (
                        <label key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: st.completed ? 'var(--text-muted)' : '#e2e8f0', cursor: 'pointer', textDecoration: st.completed ? 'line-through' : 'none' }}>
                          <input
                            type="checkbox"
                            checked={st.completed}
                            onChange={() => handleToggleSubtask(task.id, st.id)}
                            style={{ accentColor: 'var(--color-grape-light)' }}
                          />
                          <span>{st.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Column Move Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} /> {task.dueDate}
                    </span>

                    <select
                      value={task.status}
                      onChange={(e) => handleMoveStatus(task.id, e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-grape-light)', fontSize: '0.78rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="todo" style={{ background: '#0a0a0f' }}>To Do</option>
                      <option value="in_progress" style={{ background: '#0a0a0f' }}>In Progress</option>
                      <option value="done" style={{ background: '#0a0a0f' }}>Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
