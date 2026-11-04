
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

// Import Heroicons
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

// Import reusable task utility functions
import { filterTasks } from "../../utils/taskUtils";

// Storage keys
const STORAGE_KEY = "task-dashboard-tasks";
const THEME_STORAGE_KEY = "task-dashboard-theme";

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

// Check whether imported data contains valid tasks
function isTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}

function Dashboard({ initialTasks = [] }: DashboardProps) {

  // Store and remember selected theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === "dark";
    } catch {
      return false;
    }
  });

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

  // Apply and save selected theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);

    try {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        isDarkMode ? "dark" : "light"
      );
    } catch {
      console.error("Could not save theme preference.");
    }
  }, [isDarkMode]);

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

    // Close the edit form if its task was deleted
    if (editingTask?.id === taskId) {
      setEditingTask(null);
    }
  };

  // Select a task for editing
  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  // Update task order after drag and drop
  const handleReorder = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

  // Allow dragging only when no filters are active
  const canReorder =
    filters.searchTerm.trim() === "" &&
    filters.status === "all" &&
    filters.priority === "all";

  // Filter tasks using the reusable utility function
  const filteredTasks = useMemo(
    () => filterTasks(tasks, filters),
    [tasks, filters]
  );

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

    // Release the downloaded file URL
    setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
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
        window.alert(
          "Invalid task file. Please select a valid JSON export."
        );
        return;
      }

      setTasks(importedData);
      setEditingTask(null);

      // Clear old search and filters after importing
      setFilters({
        searchTerm: "",
        status: "all",
        priority: "all",
        sortBy: "createdAt",
        sortDirection: "desc",
      });

      window.alert("Tasks imported successfully!");
    } catch {
      window.alert(
        "Could not import the file. Please check the JSON file."
      );
    } finally {
      input.value = "";
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>

      <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-100 p-3 transition-colors duration-300 dark:bg-gray-950 sm:p-6 lg:p-8">
<div className="mx-auto w-full max-w-7xl min-w-0 space-y-6">

          {/* Dashboard heading and theme toggle */}
          <header className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Task Management Dashboard
              </h1>

              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Organize your tasks and track your daily progress.
              </p>
            </div>

            {/* Dark and light mode button */}
            <button
              type="button"
              onClick={() =>
                setIsDarkMode((previous) => !previous)
              }
              aria-label={
                isDarkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              aria-pressed={isDarkMode}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <>
                  <SunIcon className="h-5 w-5" />
                  Light Mode
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5" />
                  Dark Mode
                </>
              )}
            </button>

          </header>

          {/* Export and import buttons */}
          <section className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={handleExport}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Export Tasks
            </button>

            <label className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700">
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
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total tasks */}
            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Tasks
                </p>

                <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white">
                {totalTasks}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                All your tasks
              </p>
            </div>

            {/* Completed tasks */}
            <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Completed Tasks
                </p>

                <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-green-600">
                {completedTasks}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tasks finished
              </p>
            </div>

            {/* Pending tasks */}
            <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Tasks
                </p>

                <div className="rounded-lg bg-orange-50 p-2 dark:bg-orange-950">
                  <ClockIcon className="h-5 w-5 text-orange-600" />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-orange-600">
                {pendingTasks}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tasks waiting to start
              </p>
            </div>

            {/* In-progress tasks */}
            <div className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  In Progress
                </p>

                <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-950">
                  <ArrowPathIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-purple-600">
                {inProgressTasks}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tasks in progress
              </p>
            </div>

          </section>

          {/* Add or edit task */}
          <section>
            <TaskForm
              isDarkMode={isDarkMode}
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
              isDarkMode={isDarkMode}
              filters={filters}
              onFilterChange={setFilters}
            />
          </section>

          {/* Display task list */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
              My Tasks
            </h2>

            <TaskList
              tasks={filteredTasks}
              isDarkMode={isDarkMode}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onReorder={handleReorder}
              canReorder={canReorder}
            />
          </section>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
