
import { useMemo, useState } from "react";
import type {
  TaskListProps,
  TaskSortOption,
  SortDirection,
  TaskPriority,
} from "../../types";

import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onStatusChange,
  onDelete,
  onEdit,
}: TaskListProps) {

  // Store the search text
  const [searchTerm, setSearchTerm] = useState("");

  // Store the sorting option
  const [sortBy, setSortBy] = useState<TaskSortOption>("createdAt");

  // Store the sorting direction
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  // Search and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    const filteredTasks = tasks.filter((task) =>
      `${task.title} ${task.description}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const priorityOrder: Record<TaskPriority, number> = {
      low: 1,
      medium: 2,
      high: 3,
    };

    return [...filteredTasks].sort((a, b) => {
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
            priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });
  }, [tasks, searchTerm, sortBy, sortDirection]);

  return (
    <div className="space-y-4">

      {/* Search and sorting controls */}
      <div className="flex flex-col gap-3 sm:flex-row">

        {/* Search bar */}
        <input
          type="search"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="flex-1 rounded-lg border p-3"
        />

        {/* Sort options */}
        <select
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value as TaskSortOption)
          }
          className="rounded-lg border p-3"
        >
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>

        {/* Sort direction */}
        <select
          value={sortDirection}
          onChange={(event) =>
            setSortDirection(event.target.value as SortDirection)
          }
          className="rounded-lg border p-3"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

      </div>

      {/* Display task list */}
      {filteredAndSortedTasks.length === 0 ? (
        <p className="rounded-lg bg-gray-100 p-6 text-center text-gray-500">
          No tasks found.
        </p>
      ) : (
        <ul className="space-y-3">
          {filteredAndSortedTasks.map((task) => (
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
