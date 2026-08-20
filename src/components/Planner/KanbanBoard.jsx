import React, { useState } from 'react';
import { Plus, Calendar, Trash2 } from 'lucide-react';

export function KanbanBoard({ tasks, onSaveTasks }) {
  const [taskList, setTaskList] = useState(tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Computer Science');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [isAdding, setIsAdding] = useState(false);

  const columns = [
    { id: 'todo', label: 'To Do', color: '#38bdf8' },
    { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>Study Task Planner & Kanban</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Organize study objectives, homework deadlines, and AI subtask decompositions.
          </p>
        </div>

        <button onClick={() => setIsAdding(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Add Task Form Inline */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>New Study Task</h4>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title (e.g. Prepare for Physics Final Exam)..."
            required
            style={{ padding: '12px', borderRadius: '10px', background: 'rgba(5, 8, 16, 0.85)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', fontFamily: 'var(--font-main)' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <select
              value={newTaskSubject}
              onChange={(e) => setNewTaskSubject(e.target.value)}
              style={{ padding: '10px', borderRadius: '10px', background: 'rgba(5, 8, 16, 0.85)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
              <option value="Biology">Biology</option>
            </select>

            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              style={{ padding: '10px', borderRadius: '10px', background: 'rgba(5, 8, 16, 0.85)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '8px 18px' }}>Save Task</button>
          </div>
        </form>
      )}

      {/* Kanban Columns */}
      <div className="kanban-board-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px' }}>
        {columns.map(col => {
          const colTasks = taskList.filter(t => t.status === col.id);

          return (
            <div key={col.id} className="glass-panel" style={{ padding: '22px', minHeight: '420px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: `2px solid ${col.color}` }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: col.color }}>{col.label}</h4>
                <span className="badge" style={{ background: `${col.color}20`, color: col.color }}>{colTasks.length}</span>
              </div>

              {colTasks.map(task => (
                <div key={task.id} style={{ padding: '18px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{task.subject}</span>
                    <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h5 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{task.title}</h5>

                  {/* Subtask List */}
                  {task.subtasks && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '4px 0' }}>
                      {task.subtasks.map(st => (
                        <label key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: st.completed ? 'var(--text-muted)' : '#e2e8f0', cursor: 'pointer', textDecoration: st.completed ? 'line-through' : 'none' }}>
                          <input
                            type="checkbox"
                            checked={st.completed}
                            onChange={() => handleToggleSubtask(task.id, st.id)}
                            style={{ accentColor: 'var(--accent-cyan)' }}
                          />
                          <span>{st.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Column Move Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} /> Due {task.dueDate}
                    </span>

                    <select
                      value={task.status}
                      onChange={(e) => handleMoveStatus(task.id, e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="todo" style={{ background: '#0f172a' }}>To Do</option>
                      <option value="in_progress" style={{ background: '#0f172a' }}>In Progress</option>
                      <option value="done" style={{ background: '#0f172a' }}>Done</option>
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
