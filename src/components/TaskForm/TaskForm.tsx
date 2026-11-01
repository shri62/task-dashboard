
// Import React hooks
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

// Import TypeScript types
import type {
  TaskFormProps,
  TaskFormData,
  TaskPriority,
} from "../../types";

// Empty form values
const emptyForm: TaskFormData = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
};

function TaskForm({
  isDarkMode,
  onSubmit,
  initialTask,
  onCancel,
}: TaskFormProps) {

  // Store form data
  const [formData, setFormData] = useState<TaskFormData>(emptyForm);

  // Store error messages
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Styles based on selected theme
  const formStyle = isDarkMode
    ? "border-gray-700 bg-gray-800 text-white"
    : "border-gray-200 bg-white text-gray-800";

  const labelStyle = isDarkMode
    ? "text-gray-200"
    : "text-gray-700";

  const inputStyle = isDarkMode
    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
    : "border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-blue-500";

  // Load existing task when editing
  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description,
        priority: initialTask.priority,
        dueDate: initialTask.dueDate,
      });
    } else {
      setFormData(emptyForm);
    }

    setErrors({});
  }, [initialTask]);

  // Update input values
  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Check form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit the form
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    });

    // Clear form after adding a new task
    if (!initialTask) {
      setFormData(emptyForm);
      setErrors({});
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-4 rounded-xl border p-5 shadow-sm transition-colors duration-300 ${formStyle}`}
    >
      {/* Form heading */}
      <h2 className={`text-xl font-bold ${labelStyle}`}>
        {initialTask ? "Edit Task" : "Add New Task"}
      </h2>

      {/* Task title */}
      <div>
        <label
          htmlFor="task-title"
          className={`mb-1 block text-sm font-medium ${labelStyle}`}
        >
          Task Title
        </label>

        <input
          id="task-title"
          type="text"
          value={formData.title}
          onChange={(event) =>
            handleChange("title", event.target.value)
          }
          placeholder="Enter task title"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={`w-full rounded-lg border p-3 text-sm outline-none transition focus:ring-2 ${inputStyle}`}
        />

        {errors.title && (
          <p
            id="title-error"
            className="mt-1 text-sm text-red-500"
          >
            {errors.title}
          </p>
        )}
      </div>

      {/* Task description */}
      <div>
        <label
          htmlFor="task-description"
          className={`mb-1 block text-sm font-medium ${labelStyle}`}
        >
          Description
        </label>

        <textarea
          id="task-description"
          value={formData.description}
          onChange={(event) =>
            handleChange("description", event.target.value)
          }
          placeholder="Enter task description"
          rows={3}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
          className={`w-full resize-y rounded-lg border p-3 text-sm outline-none transition focus:ring-2 ${inputStyle}`}
        />

        {errors.description && (
          <p
            id="description-error"
            className="mt-1 text-sm text-red-500"
          >
            {errors.description}
          </p>
        )}
      </div>

      {/* Task priority */}
      <div>
        <label
          htmlFor="task-priority"
          className={`mb-1 block text-sm font-medium ${labelStyle}`}
        >
          Priority
        </label>

        <select
          id="task-priority"
          value={formData.priority}
          onChange={(event) =>
            handleChange(
              "priority",
              event.target.value as TaskPriority
            )
          }
          className={`w-full rounded-lg border p-3 text-sm outline-none focus:ring-2 ${inputStyle}`}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Task due date */}
      <div>
        <label
          htmlFor="task-due-date"
          className={`mb-1 block text-sm font-medium ${labelStyle}`}
        >
          Due Date
        </label>

        <input
          id="task-due-date"
          type="date"
          value={formData.dueDate}
          onChange={(event) =>
            handleChange("dueDate", event.target.value)
          }
          className={`w-full rounded-lg border p-3 text-sm outline-none focus:ring-2 ${inputStyle}`}
        />
      </div>

      {/* Form buttons */}
      <div className="flex flex-wrap gap-3">

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          {initialTask ? "Update Task" : "Add Task"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={
              isDarkMode
                ? "rounded-lg bg-gray-700 px-5 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-gray-600"
                : "rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-300"
            }
          >
            Cancel
          </button>
        )}

      </div>
    </form>
  );
}

export default TaskForm;
