
// Task status options
export type TaskStatus = "pending" | "in-progress" | "completed";

// Task priority options
export type TaskPriority = "low" | "medium" | "high";

// Sorting options
export type TaskSortOption = "title" | "dueDate" | "createdAt" | "priority";

export type SortDirection = "asc" | "desc";

// Form data for adding or editing a task
export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

// Complete task data structure
export interface Task extends TaskFormData {
  id: string;
  status: TaskStatus;
  createdAt: string;
}

// Filter options
export interface TaskFilterOptions {
  searchTerm: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  sortBy: TaskSortOption;
  sortDirection: SortDirection;
}

// TaskItem component props
export interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

// TaskList component props
export interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

// TaskForm component props
export interface TaskFormProps {
  onSubmit: (formData: TaskFormData) => void;
  initialTask?: Task | null;
  onCancel?: () => void;
}


// Props for the TaskFilter component
export interface TaskFilterProps {
  tasks: Task[];
  filters: TaskFilterOptions;
  onFilterChange: (filters: TaskFilterOptions) => void;
}

// Dashboard component props
export interface DashboardProps {
  initialTasks?: Task[];
}
