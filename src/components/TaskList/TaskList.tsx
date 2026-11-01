
// Import React hooks
import { useMemo, useState } from "react";

// Import TypeScript types
import type {
  TaskListProps,
  TaskSortOption,
  SortDirection,
  TaskPriority,
} from "../../types";

// Import TaskItem component
import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onStatusChange,
  onDelete,
  onEdit,
}: TaskListProps) {

  // Store sorting option
  const [sortBy, setSortBy] =
    useState<TaskSortOption>("createdAt");

  // Store sorting direction
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  // Sort the tasks
  const sortedTasks = useMemo(() => {

    // Assign numbers to priorities
    const priorityOrder: Record<TaskPriority, number> = {
      low: 1,
      medium: 2,
      high: 3,
    };

    // Copy tasks before sorting
    return [...tasks].sort((a, b) => {

      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;

        case "dueDate":
          comparison = a.dueDate.localeCompare(b.dueDate);
          break;

        case "createdAt":
          comparison = a.createdAt.localeCompare(b.createdAt);
          break;

        case "priority":
          comparison =
            priorityOrder[a.priority] -
            priorityOrder[b.priority];
          break;
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });

  }, [tasks, sortBy, sortDirection]);

  return (
    <div className="space-y-4">

      {/* Sorting controls */}
      <div className="flex flex-wrap items-center gap-3">

        <select
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value as TaskSortOption)
          }
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-300"
          aria-label="Sort tasks by"
        >
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>

        <select
          value={sortDirection}
          onChange={(event) =>
            setSortDirection(event.target.value as SortDirection)
          }
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-300"
          aria-label="Sort direction"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

      </div>

      {/* Display task list */}
      {sortedTasks.length === 0 ? (

        <p className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
          No tasks found. Add a task or change your filters.
        </p>

      ) : (

        <ul className="space-y-3">

          {sortedTasks.map((task) => (

            <li key={task.id}>
              <TaskItem
                task={task}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </li>

          ))}

        </ul>

      )}

    </div>
  );
}

export default TaskList;
