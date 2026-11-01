
// Import React hooks
import { useMemo, useState } from "react";

// Import TypeScript types
import type {
  TaskFilterProps,
  TaskStatus,
  TaskPriority,
} from "../../types";

function TaskFilter({
  tasks,
  isDarkMode,
  filters,
  onFilterChange,
}: TaskFilterProps) {

  // Show or hide search suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Styles based on selected theme
  const containerStyle = isDarkMode
    ? "border-gray-700 bg-gray-800"
    : "border-gray-200 bg-white";

  const headingStyle = isDarkMode
    ? "text-white"
    : "text-gray-800";

  const inputStyle = isDarkMode
    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
    : "border-gray-300 bg-white text-gray-800 placeholder-gray-400";

  const secondaryTextStyle = isDarkMode
    ? "text-gray-300"
    : "text-gray-600";

  const suggestionStyle = isDarkMode
    ? "border-gray-600 bg-gray-700 hover:bg-gray-600"
    : "border-gray-200 bg-white hover:bg-blue-50";

  // Find matching tasks while typing
  const suggestions = useMemo(() => {
    const search = filters.searchTerm.trim().toLowerCase();

    if (!search) {
      return [];
    }

    return tasks
      .filter((task) =>
        `${task.title} ${task.description}`
          .toLowerCase()
          .includes(search)
      )
      .slice(0, 5);
  }, [tasks, filters.searchTerm]);

  // Update search text
  const handleSearch = (value: string) => {
    onFilterChange({
      ...filters,
      searchTerm: value,
    });

    setShowSuggestions(true);
  };

  // Select a suggested task
  const handleSuggestionClick = (title: string) => {
    onFilterChange({
      ...filters,
      searchTerm: title,
    });

    setShowSuggestions(false);
  };

  // Update task status
  const handleStatusChange = (value: TaskStatus | "all") => {
    onFilterChange({
      ...filters,
      status: value,
    });
  };

  // Update task priority
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

    setShowSuggestions(false);
  };

  // Check whether any filter is active
  const hasActiveFilters =
    filters.searchTerm.trim() !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all";

  return (
    <div
      className={`space-y-4 rounded-xl border p-4 shadow-sm transition-colors duration-300 ${containerStyle}`}
    >

      {/* Section heading */}
      <h2 className={`text-lg font-bold ${headingStyle}`}>
        Search and Filter Tasks
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Search with autocomplete */}
        <div className="relative">

          <input
            type="search"
            value={filters.searchTerm}
            onChange={(event) => handleSearch(event.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            autoComplete="off"
            className={`w-full rounded-lg border p-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-400 ${inputStyle}`}
          />

          {/* Show matching task suggestions */}
          {showSuggestions && filters.searchTerm.trim() && (
            <div
              className={`absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >

              {suggestions.length > 0 ? (
                suggestions.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleSuggestionClick(task.title)}
                    className={`block w-full border-b p-3 text-left transition ${
                      suggestionStyle
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </p>

                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {task.description}
                    </p>
                  </button>
                ))
              ) : (
                <p className={`p-3 text-sm ${secondaryTextStyle}`}>
                  No matching tasks found.
                </p>
              )}

            </div>
          )}
        </div>

        {/* Filter by status */}
        <select
          value={filters.status}
          onChange={(event) =>
            handleStatusChange(event.target.value as TaskStatus | "all")
          }
          aria-label="Filter by status"
          className={`rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${inputStyle}`}
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
          aria-label="Filter by priority"
          className={`rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${inputStyle}`}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

      </div>

      {/* Display active filters */}
      <div className="flex flex-wrap items-center gap-2">

        <span className={`text-sm font-medium ${secondaryTextStyle}`}>
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
          <span className={`text-sm ${secondaryTextStyle}`}>
            No filters selected
          </span>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className={`rounded-lg px-3 py-1 text-sm transition ${
              isDarkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Clear Filters
          </button>
        )}

      </div>
    </div>
  );
}

export default TaskFilter;
