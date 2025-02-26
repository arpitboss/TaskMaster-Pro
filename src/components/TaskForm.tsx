import React, { useState, useEffect } from "react";
import { Task, NewTaskData } from "../tasks";

interface TaskFormProps {
  onSubmit: (data: Task | NewTaskData) => void;
  editingTask: Task | null;
  clearEditing: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  editingTask,
  clearEditing,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
      setDueDate(editingTask.dueDate);
      setPriority(editingTask.priority);
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("low");
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      setErrorMessage("Please fill in all required fields");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    const taskData: NewTaskData = { title, description, dueDate, priority };
    if (editingTask) {
      onSubmit({ ...editingTask, ...taskData });
    } else {
      onSubmit(taskData);
    }
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("low");
    if (editingTask) clearEditing();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Task Title</label>
        <input
          type="text"
          id="title"
          required
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={3}
          placeholder="Task details (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            required
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <button type="submit" className="submit-btn">
        {editingTask ? (
          <>
            <i className="fas fa-save"></i> Update Task
          </>
        ) : (
          <>
            <i className="fas fa-plus-circle"></i> Add Task
          </>
        )}
      </button>
      {errorMessage && (
        <div className="error-message" style={{ display: "block" }}>
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export default TaskForm;
