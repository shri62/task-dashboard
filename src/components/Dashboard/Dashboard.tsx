
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

// Import dashboard icons
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

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

// Check whether imported data contains valid tasks
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

    // Close the edit form if its task was deleted
    if (editingTask?.id === taskId) {
      setEditingTask(null);
    }
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
          .includes(filters.searchTerm.trim().toLowerCase());

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
        window.alert("Invalid task file. Please select a valid JSON export.");
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
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total tasks */}
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Total Tasks
              </p>

              <div className="rounded-xl bg-blue-50 p-2">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-gray-800">
              {totalTasks}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              All your tasks
            </p>
          </div>

          {/* Completed tasks */}
          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Completed Tasks
              </p>

              <div className="rounded-xl bg-green-50 p-2">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-green-600">
              {completedTasks}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tasks finished
            </p>
          </div>

          {/* Pending tasks */}
          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Pending Tasks
              </p>

              <div className="rounded-xl bg-orange-50 p-2">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-orange-600">
              {pendingTasks}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tasks waiting to start
            </p>
          </div>

          {/* In-progress tasks */}
          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                In Progress
              </p>

              <div className="rounded-xl bg-purple-50 p-2">
                <ArrowPathIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-purple-600">
              {inProgressTasks}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tasks in progress
            </p>
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
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
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
