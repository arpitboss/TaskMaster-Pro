import React from 'react';
import { Task } from '../tasks';

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onEdit, onToggleComplete }) => {
  return (
    <li
      className={`task-item ${task.priority} ${task.completed ? "completed" : ""}`}
      data-id={task.id}
    >
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <small>Due: {new Date(task.dueDate).toLocaleDateString()}</small>
          <span className="priority">{task.priority}</span>
        </div>
      </div>
      <div className="task-actions">
        <input aria-label='checkbox'
          type="checkbox"
          checked={task.completed}
          className="complete-checkbox"
          onChange={() => onToggleComplete(task.id)}
        />
        <button className="edit-btn" onClick={() => onEdit(task.id)}>
          Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
