
// Import React hooks
import { useMemo, useState } from "react";

// Import drag-and-drop tools
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";

// Import sortable tools
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Import CSS transform helper
import { CSS } from "@dnd-kit/utilities";

// Import drag handle icon
import { Bars3Icon } from "@heroicons/react/24/outline";

// Import TypeScript types
import type {
  Task,
  TaskListProps,
  TaskSortOption,
  SortDirection,
  TaskPriority,
} from "../../types";

// Import TaskItem component
import TaskItem from "./TaskItem";

// Props for an individual sortable task
type SortableTaskProps = {
  task: Task;
  isDarkMode: boolean;
  canReorder: boolean;
  onStatusChange: TaskListProps["onStatusChange"];
  onDelete: TaskListProps["onDelete"];
  onEdit: TaskListProps["onEdit"];
};

// Make an individual task draggable
function SortableTask({
  task,
  isDarkMode,
  canReorder,
  onStatusChange,
  onDelete,
  onEdit,
}: SortableTaskProps) {

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: !canReorder,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="flex items-center gap-2"
    >

      {/* Drag handle */}
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        disabled={!canReorder}
        aria-label={`Drag ${task.title} to reorder`}
        title={
          canReorder
            ? "Drag to reorder"
            : "Select Manual Order and clear filters to reorder"
        }
        className={`shrink-0 rounded-md p-2 ${
          canReorder
            ? "cursor-grab text-gray-500 hover:bg-gray-100 active:cursor-grabbing dark:text-gray-300 dark:hover:bg-gray-700"
            : "cursor-not-allowed text-gray-300 dark:text-gray-600"
        }`}
      >
        <Bars3Icon className="h-5 w-5" />
      </button>

      {/* Display task card */}
      <div className="min-w-0 flex-1">
        <TaskItem
          task={task}
          isDarkMode={isDarkMode}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>

    </div>
  );
}

function TaskList({
  tasks,
  isDarkMode,
  onStatusChange,
  onDelete,
  onEdit,
  onReorder,
  canReorder,
}: TaskListProps) {

  // Store sorting option
  const [sortBy, setSortBy] =
    useState<TaskSortOption>("createdAt");

  // Store sorting direction
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  // Configure mouse and keyboard dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort tasks
  const sortedTasks = useMemo(() => {

    // Manual mode keeps the current task order
    if (sortBy === "manual") {
      return [...tasks];
    }

    const priorityOrder: Record<TaskPriority, number> = {
      low: 1,
      medium: 2,
      high: 3,
    };

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

  // Enable dragging only in manual mode without filters
  const dragEnabled =
    canReorder && sortBy === "manual";

  // Handle the end of dragging
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !dragEnabled) {
      return;
    }

    const oldIndex = sortedTasks.findIndex(
      (task) => task.id === String(active.id)
    );

    const newIndex = sortedTasks.findIndex(
      (task) => task.id === String(over.id)
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Create the new task order
    const reorderedTasks = arrayMove(
      sortedTasks,
      oldIndex,
      newIndex
    );

    // Send new order to Dashboard
    onReorder(reorderedTasks);
  };

  return (
    <div className="space-y-4">

      {/* Sorting controls */}
      <div className="flex flex-wrap items-center gap-3">

        <select
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value as TaskSortOption)
          }
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          aria-label="Sort tasks by"
        >
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="manual">Manual Order (Drag & Drop)</option>
        </select>

        <select
          value={sortDirection}
          onChange={(event) =>
            setSortDirection(event.target.value as SortDirection)
          }
          disabled={sortBy === "manual"}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          aria-label="Sort direction"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

      </div>

      {/* Reordering instructions */}
      {sortBy === "manual" && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {canReorder
            ? "Drag the handle beside a task to change its position."
            : "Clear all search and filters to enable task reordering."}
        </p>
      )}

      {/* Display tasks */}
      {sortedTasks.length === 0 ? (
        <p className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-300">
          No tasks found. Add a task or change your filters.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedTasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-3">
              {sortedTasks.map((task) => (
                <li key={task.id}>
                  <SortableTask
                    task={task}
                    isDarkMode={isDarkMode}
                    canReorder={dragEnabled}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                </li>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

    </div>
  );
}

export default TaskList;
