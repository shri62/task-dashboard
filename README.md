# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.




# Task Management Dashboard

## About My Project

I created a Task Management Dashboard using React and TypeScript.

This application helps users organize and manage their daily tasks.

Users can add, edit, delete, search, filter, and sort tasks.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- HTML
- CSS
- LocalStorage

## Features

- Add new tasks.
- Edit existing tasks.
- Delete tasks.
- Search tasks by name.
- Filter tasks by status and priority.
- Sort tasks.
- View total, completed, pending, and in-progress tasks.
- Save tasks in LocalStorage.
- Import and export tasks using JSON files.
- Switch between light and dark mode.
- Responsive design for desktop, tablet, and mobile.
- Form validation with error messages.

## Project Installation

Clone the GitHub repository:

```bash
git clone https://github.com/shri62/task-dashboard.git
```

Go to the project folder:

```bash
cd task-dashboard
```

Install the required packages:

```bash
npm install
```

Start the application:

```bash
npm run dev
```

Open the local URL shown in your terminal to view the application.

## Project Structure

```text
src/
├── components/
│   ├── TaskList/
│   ├── TaskForm/
│   ├── TaskFilter/
│   └── Dashboard/
├── types/
│   └── index.ts
├── utils/
│   └── taskUtils.ts
├── App.tsx
└── main.tsx
```

## What I Learned

Through this project, I practiced React components, TypeScript, props, state management, forms, and event handling.

I also learned how to organize a project and build a responsive web application.


