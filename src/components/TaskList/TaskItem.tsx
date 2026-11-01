
// Import Heroicons
import {
  PencilSquareIcon,
  TrashIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

// Import Task types
import type {
  TaskItemProps,
  TaskStatus,
  TaskPriority,
} from "../../types";

// Colors for different task statuses
const statusStyles: Record<TaskStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  "in-progress": "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-green-200 bg-green-50 text-green-700",
};

// Colors for different priorities
const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-green-50 text-green-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

function TaskItem({
  task,
  isDarkMode,
  onStatusChange,
  onDelete,
  onEdit,
}: TaskItemProps) {

  // Choose the task card colors based on the selected theme
  const cardStyle = isDarkMode
    ? "border-gray-700 bg-gray-800 text-white"
    : "border-gray-200 bg-white text-gray-800";

  const descriptionStyle = isDarkMode
    ? "text-gray-300"
    : "text-gray-600";

  const dateStyle = isDarkMode
    ? "text-gray-400"
    : "text-gray-500";

  const buttonBase = isDarkMode
    ? "border-gray-600 hover:bg-gray-700"
    : "border-gray-200 hover:bg-gray-50";

  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between ${cardStyle}`}
    >

      {/* Task information */}
      <div className="min-w-0 flex-1 space-y-2">

        <h3 className="text-base font-semibold">
          {task.title}
        </h3>

        <p className={`text-sm ${descriptionStyle}`}>
          {task.description}
        </p>

        {/* Priority and due date */}
        <div className="flex flex-wrap items-center gap-3 pt-1">

          <span
            className={`rounded-sm px-2 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
          >
            Priority: {task.priority}
          </span>

          <span className={`flex items-center gap-1 text-xs ${dateStyle}`}>
            <CalendarDaysIcon className="h-4 w-4 shrink-0" />
            Due: {task.dueDate || "No due date"}
          </span>

        </div>
      </div>

      {/* Status and action buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">

        {/* Change task status */}
        <select
          value={task.status}
          onChange={(event) =>
            onStatusChange(
              task.id,
              event.target.value as TaskStatus
            )
          }
          aria-label={`Status of ${task.title}`}
          className={`rounded-md border px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-300 ${statusStyles[task.status]}`}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Edit button */}
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
          className={`flex items-center gap-1 rounded-md border px-3 py-2 text-sm text-blue-600 transition ${buttonBase}`}
        >
          <PencilSquareIcon className="h-4 w-4" />
          Edit
        </button>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
          className={`flex items-center gap-1 rounded-md border px-3 py-2 text-sm text-red-600 transition ${buttonBase}`}
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>

      </div>
    </div>
  );
}

export default TaskItem;
