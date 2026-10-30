
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

function TaskForm({ onSubmit, initialTask, onCancel }: TaskFormProps) {

  // Store form data
  const [formData, setFormData] = useState<TaskFormData>(emptyForm);

  // Store error messages
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      className="space-y-4 rounded-lg border bg-white p-5 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-800">
        {initialTask ? "Edit Task" : "Add New Task"}
      </h2>

      {/* Task title */}
      <div>
        <label className="mb-1 block font-medium">
          Task Title
        </label>

        <input
          type="text"
          value={formData.title}
          onChange={(event) =>
            handleChange("title", event.target.value)
          }
          placeholder="Enter task title"
          className="w-full rounded-lg border p-3"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      {/* Task description */}
      <div>
        <label className="mb-1 block font-medium">
          Description
        </label>

        <textarea
          value={formData.description}
          onChange={(event) =>
            handleChange("description", event.target.value)
          }
          placeholder="Enter task description"
          rows={3}
          className="w-full rounded-lg border p-3"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      {/* Task priority */}
      <div>
        <label className="mb-1 block font-medium">
          Priority
        </label>

        <select
          value={formData.priority}
          onChange={(event) =>
            handleChange(
              "priority",
              event.target.value as TaskPriority
            )
          }
          className="w-full rounded-lg border p-3"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Task due date */}
      <div>
        <label className="mb-1 block font-medium">
          Due Date
        </label>

        <input
          type="date"
          value={formData.dueDate}
          onChange={(event) =>
            handleChange("dueDate", event.target.value)
          }
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* Form buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {initialTask ? "Update Task" : "Add Task"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
