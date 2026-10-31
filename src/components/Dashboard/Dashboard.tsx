
// Import React hooks
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

// Import TypeScript types
import type {
  DashboardProps,
  Task,
  TaskFormData,
  TaskFilterOptions,
  TaskStatus,
} from "../../types";

// Import components
import TaskForm from "../TaskForm/TaskForm";
import TaskList from "../TaskList/TaskList";
import TaskFilter from "../TaskFilter/TaskFilter";

// Name used to save tasks in localStorage
const STORAGE_KEY = "task-dashboard-tasks";

// Check whether imported data is a valid task
function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    typeof task.dueDate === "string" &&
    typeof task.createdAt === "string" &&
    (task.priority === "low" ||
      task.priority === "medium" ||
      task.priority === "high") &&
    (task.status === "pending" ||
      task.status === "in-progress" ||
      task.status === "completed")
  );
}

// Check whether the imported data contains valid tasks
function isTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}

function Dashboard({ initialTasks = [] }: DashboardProps) {

  // Load saved tasks from localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);

      if (savedTasks) {
        const parsedData: unknown = JSON.parse(savedTasks);

        if (isTaskList(parsedData)) {
          return parsedData;
        }
      }
    } catch {
      console.error("Could not load saved tasks.");
    }

    return initialTasks;
  });

  // Store filter options
  const [filters, setFilters] = useState<TaskFilterOptions>({
    searchTerm: "",
    status: "all",
    priority: "all",
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  // Store the task being edited
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Save tasks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      console.error("Could not save tasks.");
    }
  }, [tasks]);

  // Add a new task or update an existing task
  const handleTaskSubmit = (formData: TaskFormData) => {
    if (editingTask) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...formData }
            : task
        )
      );

      setEditingTask(null);
    } else {
      const newTask: Task = {
        ...formData,
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setTasks((previousTasks) => [...previousTasks, newTask]);
    }
  };

  // Update task status
  const handleStatusChange = (
    taskId: string,
    status: TaskStatus
  ) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  // Delete a task
  const handleDelete = (taskId: string) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId)
    );
  };

  // Select a task for editing
  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  // Filter tasks by search, status, and priority
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchMatch =
        `${task.title} ${task.description}`
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const statusMatch =
        filters.status === "all" ||
        task.status === filters.status;

      const priorityMatch =
        filters.priority === "all" ||
        task.priority === filters.priority;

      return searchMatch && statusMatch && priorityMatch;
    });
  }, [tasks, filters]);

  // Calculate task statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  // Download tasks as a JSON file
  const handleExport = () => {
    const file = new Blob(
      [JSON.stringify(tasks, null, 2)],
      { type: "application/json" }
    );

    const fileUrl = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "task-dashboard-tasks.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };

  // Import tasks from a JSON file
  const handleImport = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const fileContent = await file.text();
      const importedData: unknown = JSON.parse(fileContent);

      if (!isTaskList(importedData)) {
        window.alert("Invalid task file. Please select a valid JSON export.");
        return;
      }

      setTasks(importedData);
      setEditingTask(null);

      window.alert("Tasks imported successfully!");
    } catch {
      window.alert("Could not import the file. Please check the JSON file.");
    } finally {
      input.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Dashboard heading */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800">
            Task Management Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Organize your tasks and track your daily progress.
          </p>
        </header>

        {/* Export and import buttons */}
        <section className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Export Tasks
          </button>

          <label className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Import Tasks

            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </section>

        {/* Task statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {totalTasks}
            </h2>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Completed Tasks</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {completedTasks}
            </h2>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Pending Tasks</p>
            <h2 className="mt-2 text-3xl font-bold text-orange-500">
              {pendingTasks}
            </h2>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">In Progress</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-600">
              {inProgressTasks}
            </h2>
          </div>

        </section>

        {/* Add or edit task */}
        <section>
          <TaskForm
            key={editingTask?.id ?? "new-task"}
            onSubmit={handleTaskSubmit}
            initialTask={editingTask}
            onCancel={
              editingTask
                ? () => setEditingTask(null)
                : undefined
            }
          />
        </section>

        {/* Search and filter tasks */}
        <section>
          <TaskFilter
  tasks={tasks}
  filters={filters}
  onFilterChange={setFilters}
/>
        </section>

        {/* Display task list */}
        <section className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            My Tasks
          </h2>

          <TaskList
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </section>

      </div>
    </div>
  );
}

export default Dashboard;
