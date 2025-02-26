import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Task, NewTaskData } from './tasks';

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const priorityChartRef = useRef<HTMLCanvasElement>(null);
  const completionChartRef = useRef<HTMLCanvasElement>(null);
  const priorityChartInstance = useRef<Chart | null>(null);
  const completionChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    if (activeSection === "reports") {
      initCharts();
    }
  }, [tasks, activeSection]);

  const addTask = (taskData: NewTaskData) => {
    const newTask: Task = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      completed: false,
      created: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskData: Task) => {
    setTasks(prev =>
      prev.map(task => (task.id === taskData.id ? { ...task, ...taskData } : task))
    );
    setEditingTask(null);
  };

  const handleTaskSubmit = (data: Task | NewTaskData) => {
    if (editingTask) {
      updateTask({ ...editingTask, ...data } as Task);
    } else {
      addTask(data as NewTaskData);
    }
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingTask(task);
      setActiveSection("tasks");
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const initCharts = () => {
    if (priorityChartInstance.current) {
      priorityChartInstance.current.destroy();
    }
    if (completionChartInstance.current) {
      completionChartInstance.current.destroy();
    }
    if (priorityChartRef.current) {
      priorityChartInstance.current = new Chart(priorityChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["High", "Medium", "Low"],
          datasets: [
            {
              data: [
                tasks.filter((t) => t.priority === "high").length,
                tasks.filter((t) => t.priority === "medium").length,
                tasks.filter((t) => t.priority === "low").length,
              ],
              backgroundColor: ["#E74C3C", "#F1C40F", "#27AE60"],
            },
          ],
        },
      });
    }
    if (completionChartRef.current) {
      completionChartInstance.current = new Chart(completionChartRef.current, {
        type: "bar",
        data: {
          labels: ["Completed", "Pending"],
          datasets: [
            {
              label: "Tasks",
              data: [
                tasks.filter((t) => t.completed).length,
                tasks.filter((t) => !t.completed).length,
              ],
              backgroundColor: ["#27AE60", "#4A90E2"],
            },
          ],
        },
      });
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <i className="fas fa-tasks"></i> TaskMaster Pro
          </h1>
          <nav className="nav">
            <button
              className={`nav-link ${activeSection === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveSection("dashboard")}
            >
              <i className="fas fa-home"></i> Dashboard
            </button>
            <button
              className={`nav-link ${activeSection === "tasks" ? "active" : ""}`}
              onClick={() => setActiveSection("tasks")}
            >
              <i className="fas fa-list-check"></i> Tasks
            </button>
            <button
              className={`nav-link ${activeSection === "reports" ? "active" : ""}`}
              onClick={() => setActiveSection("reports")}
            >
              <i className="fas fa-chart-pie"></i> Reports
            </button>
            <button
              className={`nav-link ${activeSection === "profile" ? "active" : ""}`}
              onClick={() => setActiveSection("profile")}
            >
              <i className="fas fa-user"></i> Profile
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        {activeSection === "dashboard" && (
          <section id="dashboard" className="content-section visible">
            <div className="dashboard-grid">
              <div className="stats-card total-tasks">
                <h3>Total Tasks</h3>
                <div className="stat-value" id="totalTasks">{totalTasks}</div>
                <i className="fas fa-inbox"></i>
              </div>
              <div className="stats-card completed-tasks">
                <h3>Completed</h3>
                <div className="stat-value" id="completedTasks">{completedTasks}</div>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stats-card upcoming-tasks">
                <h3>Upcoming Deadlines</h3>
                <ul className="deadline-list" id="deadlineList">
                  {upcomingTasks.map(task => (
                    <li key={task.id} className="deadline-item">
                      <div className="upcoming-tasks-title">{task.title}</div>
                      <small>{new Date(task.dueDate).toLocaleDateString()}</small>
                    </li>
                  ))}
                </ul>
                <i className="fas fa-list"></i>
              </div>
            </div>
          </section>
        )}

        {activeSection === "tasks" && (
          <section id="tasks" className="content-section visible">
            <div className="task-management">
              <div className="task-form-container">
                <h2>
                  <i className="fas fa-pen-to-square"></i>{" "}
                  {editingTask ? "Edit Task" : "Create Task"}
                </h2>
                <TaskForm
                  onSubmit={handleTaskSubmit}
                  editingTask={editingTask}
                  clearEditing={() => setEditingTask(null)}
                />
              </div>
              <div className="task-list-container">
                <div className="list-header">
                  <h2>
                    <i className="fas fa-list-check"></i> Your Tasks
                  </h2>
                </div>
                <TaskList
                  tasks={tasks}
                  onDelete={deleteTask}
                  onEdit={handleEditTask}
                  onToggleComplete={toggleComplete}
                />
              </div>
            </div>
          </section>
        )}

        {activeSection === "reports" && (
          <section id="reports" className="content-section visible">
            <div className="reports-grid">
              <div className="chart-card" style={{ maxWidth: '320px', margin: '0 auto' }}>
                <h3>
                  <i className="fas fa-chart-pie"></i> Priority Distribution
                </h3>
                <canvas
                  id="priorityChart"
                  ref={priorityChartRef}
                  style={{ width: "300px", height: "300px" }}
                ></canvas>
              </div>
              <div className="chart-card" style={{ maxWidth: '320px', margin: '0 auto' }}>
                <h3>
                  <i className="fas fa-chart-line"></i> Completion Trend
                </h3>
                <canvas
                  id="completionChart"
                  ref={completionChartRef}
                  style={{ width: "300px", height: "300px" }}
                ></canvas>
              </div>
            </div>
          </section>
        )}

        {activeSection === "profile" && (
          <section id="profile" className="content-section visible">
            <div className="profile-grid">
              <div
                className="profile-card"
                style={{ maxWidth: "500px", margin: "0 auto" }}
              >
                <div className="profile-header">
                  <img
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    alt="User avatar"
                    className="profile-avatar"
                  />
                  <div className="profile-info">
                    <h2>Arpit Verma</h2>
                    <p>Senior Task Manager</p>
                    <div className="rating-stars">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star-half-alt"></i>
                    </div>
                  </div>
                </div>
                <div className="profile-stats">
                  <div className="stat-item">
                    <i className="fas fa-clock"></i>
                    <span>Total Hours</span>
                    <strong>120h</strong>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-trophy"></i>
                    <span>Completed</span>
                    <strong id="profileCompletedTasks">{completedTasks}</strong>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-bolt"></i>
                    <span>Productivity</span>
                    <strong>85%</strong>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-calendar-check"></i>
                    <span>Active Days</span>
                    <strong>28</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>
            📧 Contact:
            <a href="mailto:task@arpitverma.com" className="footer-link">
              travel@arpitverma.com
            </a>
          </p>
          <p>
            📞 Support:
            <a href="tel:+918465792345" className="footer-link">
              +91 8465792345
            </a>
          </p>
          <p className="copyright">
            © 2025 TaskMaster Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
