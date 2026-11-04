
// Import TypeScript types
import type {
  Task,
  TaskFormData,
  TaskFilterOptions,
  TaskPriority,
  TaskSortOption,
  SortDirection,
} from "../types";

// Filter tasks by search, status, and priority
export function filterTasks(
  tasks: Task[],
  filters: TaskFilterOptions
): Task[] {
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
}

// Sort tasks by title, date, or priority
export function sortTasks(
  tasks: Task[],
  sortBy: TaskSortOption,
  direction: SortDirection
): Task[] {

  // Manual sorting preserves the existing task order
  if (sortBy === "manual") {
    return [...tasks];
  }

  const priorityOrder: Record<TaskPriority, number> = {
    low: 1,
    medium: 2,
    high: 3,
  };

  // Copy the array before sorting
  const sortedTasks = [...tasks];

  sortedTasks.sort((a, b) => {
    let result = 0;

    switch (sortBy) {
      case "title":
        result = a.title.localeCompare(b.title);
        break;

      case "dueDate":
        result = a.dueDate.localeCompare(b.dueDate);
        break;

      case "createdAt":
        result = a.createdAt.localeCompare(b.createdAt);
        break;

      case "priority":
        result =
          priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
    }

    return direction === "asc" ? result : -result;
  });

  return sortedTasks;
}

// Validate task form data
export function validateTaskForm(
  formData: TaskFormData
): Record<string, string> {

  const errors: Record<string, string> = {};

  if (!formData.title.trim()) {
    errors.title = "Task title is required";
  } else if (formData.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (!formData.description.trim()) {
    errors.description = "Description is required";
  }

  return errors;
}

// Format dates for display
export function formatDate(dateString: string): string {

  if (!dateString) {
    return "No due date";
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
