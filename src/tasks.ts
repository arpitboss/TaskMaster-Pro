export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  created: string;
}

export function loadTasks(): Task[] {
  const tasksJSON: string | null = localStorage.getItem("tasks");
  if (tasksJSON) {
    try {
      const tasks: Task[] = JSON.parse(tasksJSON);
      return tasks;
    } catch (error) {
      console.error("Error parsing tasks from localStorage:", error);
      return [];
    }
  }
  return [];
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function addTask(task: Task): Task[] {
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
}

export function updateTask(updatedTask: Task): Task[] {
  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === updatedTask.id);
  if (index === -1) {
    throw new Error("Task not found");
  }
  tasks[index] = updatedTask;
  saveTasks(tasks);
  return tasks;
}

export function deleteTask(taskId: number): Task[] {
  let tasks = loadTasks();
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks(tasks);
  return tasks;
}

export function toggleComplete(taskId: number): Task[] {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  task.completed = !task.completed;
  saveTasks(tasks);
  return tasks;
}

export type NewTaskData = Omit<Task, "id" | "completed" | "created">;
