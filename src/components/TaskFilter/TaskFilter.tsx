
// Import TypeScript types
import type {
  TaskFilterProps,
  TaskStatus,
  TaskPriority,
} from "../../types";

function TaskFilter({ filters, onFilterChange }: TaskFilterProps) {

  // Update search text
  const handleSearch = (value: string) => {
    onFilterChange({
      ...filters,
      searchTerm: value,
    });
  };

  // Filter tasks by status
  const handleStatusChange = (value: TaskStatus | "all") => {
    onFilterChange({
      ...filters,
      status: value,
    });
  };

  // Filter tasks by priority
  const handlePriorityChange = (value: TaskPriority | "all") => {
    onFilterChange({
      ...filters,
      priority: value,
    });
  };

  // Clear all filters
  const handleClear = () => {
    onFilterChange({
      ...filters,
      searchTerm: "",
      status: "all",
      priority: "all",
    });
  };

  // Check whether any filter is selected
  const hasActiveFilters =
    filters.searchTerm.trim() !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all";

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">

      <h2 className="text-lg font-bold text-gray-800">
        Search and Filter Tasks
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Search tasks */}
        <input
          type="search"
          value={filters.searchTerm}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search tasks..."
          className="rounded-lg border p-3"
        />

        {/* Filter by status */}
        <select
          value={filters.status}
          onChange={(event) =>
            handleStatusChange(event.target.value as TaskStatus | "all")
          }
          className="rounded-lg border p-3"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Filter by priority */}
        <select
          value={filters.priority}
          onChange={(event) =>
            handlePriorityChange(event.target.value as TaskPriority | "all")
          }
          className="rounded-lg border p-3"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

      </div>

      {/* Show active filters */}
      <div className="flex flex-wrap items-center gap-2">

        <span className="text-sm font-medium text-gray-600">
          Active filters:
        </span>

        {filters.searchTerm && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
            Search: {filters.searchTerm}
          </span>
        )}

        {filters.status !== "all" && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
            Status: {filters.status}
          </span>
        )}

        {filters.priority !== "all" && (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
            Priority: {filters.priority}
          </span>
        )}

        {!hasActiveFilters && (
          <span className="text-sm text-gray-500">
            No filters selected
          </span>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
          >
            Clear Filters
          </button>
        )}

      </div>
    </div>
  );
}

export default TaskFilter;
