
// Task status options
export type TaskStatus =
  | "pending"
  | "in-progress"
  | "completed";

// Task priority options
export type TaskPriority =
  | "low"
  | "medium"
  | "high";

// Sorting options
export type TaskSortOption =
  | "title"
  | "dueDate"
  | "createdAt"
  | "priority"
  | "manual";

// Sorting direction
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
  isDarkMode: boolean;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

// TaskList component props
export interface TaskListProps {
  tasks: Task[];
  isDarkMode: boolean;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onReorder: (reorderedTasks: Task[]) => void;
  canReorder: boolean;
}

// TaskForm component props
export interface TaskFormProps {
  isDarkMode: boolean;
  onSubmit: (formData: TaskFormData) => void;
  initialTask?: Task | null;
  onCancel?: () => void;
}

// TaskFilter component props
export interface TaskFilterProps {
  tasks: Task[];
  isDarkMode: boolean;
  filters: TaskFilterOptions;
  onFilterChange: (filters: TaskFilterOptions) => void;
}

// Dashboard component props
export interface DashboardProps {
  initialTasks?: Task[];
}
