
// Import Heroicons
import {
  PencilSquareIcon,
  TrashIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

// Import Task types
import type { TaskItemProps, TaskStatus } from "../../types";

function TaskItem({
  task,
  onStatusChange,
  onDelete,
  onEdit,
}: TaskItemProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

      {/* Display task information */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">
          {task.title}
        </h3>

        <p className="text-sm text-gray-600">
          {task.description}
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Priority: {task.priority}
        </p>

        <p className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDaysIcon className="h-4 w-4" />
          {task.dueDate || "No due date"}
        </p>
      </div>

      {/* Change task status */}
      <select
        value={task.status}
        onChange={(event) =>
          onStatusChange(task.id, event.target.value as TaskStatus)
        }
        className="rounded border p-2"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Edit and delete buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >
          <PencilSquareIcon className="h-4 w-4" />
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>
      </div>

    </div>
  );
}

export default TaskItem;
