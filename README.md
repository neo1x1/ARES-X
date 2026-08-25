# ARES-X | Enterprise Visual Workflow Workbench

## Overview

ARES-X is a professional desktop application for building and executing visual workflows. Built with React, Vite, and React Flow, it provides a comprehensive platform for designing, validating, and executing complex workflows with a focus on enterprise usability.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Architecture

### Project Structure

```
src/
├── app/
├── components/
│   ├── canvas/
│   ├── TopBar.jsx
│   ├── LeftSidebar.jsx
│   ├── RightInspector.jsx
│   ├── BottomStatusBar.jsx
│   ├── ExecutionConsole.jsx
│   ├── SettingsPanel.jsx
│   └── NotificationContainer.jsx
├── state/
│   ├── workflowStore.js
│   ├── notificationStore.js
│   ├── settingsStore.js
│   └── registryStore.js
├── registry/
│   └── nodeRegistry.js
├── styles/
│   └── global.css
└── App.jsx
```

### State Management

ARES-X uses Zustand for state management with the following stores:

- **workflowStore**: Workflow nodes, edges, execution state, history
- **notificationStore**: Toast notifications
- **settingsStore**: User settings and preferences
- **registryStore**: Node definitions and registry

### Components

- **TopBar**: Project name, status, save/run controls
- **LeftSidebar**: Node library with search and categories
- **Canvas**: React Flow-based visual workflow editor
- **RightInspector**: Node property editor
- **BottomStatusBar**: Workflow status indicators
- **ExecutionConsole**: Execution logs and output
- **SettingsPanel**: Application settings
- **NotificationContainer**: Toast notifications

## Features

### Core Functionality

- ✅ Visual workflow canvas with drag-and-drop
- ✅ Node library with categories and search
- ✅ Node selection and multi-selection
- ✅ Connection validation
- ✅ Node configuration via inspector
- ✅ Workflow validation
- ✅ Execution state tracking
- ✅ Execution logging
- ✅ Undo/Redo history
- ✅ Settings persistence
- ✅ Toast notifications

### Nodes

Core nodes include:

- **Input**: Text, Number, Boolean inputs
- **Data**: Set/Get values, storage operations
- **Logic**: Conditions, comparisons, branching
- **Utility**: Delays, comments
- **Output**: Output node, logging
- **Text**: Concatenation and text operations
- **JSON**: JSON parsing and stringification

## Development

### Adding a New Node

1. Create a new node definition in `src/registry/nodeRegistry.js`
2. Register it in the `coreNodes` array
3. It will automatically appear in the node library

### Styling

ARES-X uses CSS custom properties (variables) defined in `global.css`:

- Primary color: `--accent-primary: #35CAFF`
- Success: `--accent-success: #4DD9A0`
- Error: `--accent-error: #FF6575`
- Background: `--bg-primary: #050B11`

## Keyboard Shortcuts

- `Ctrl+S`: Save project
- `Ctrl+Z`: Undo
- `Ctrl+Shift+Z`: Redo
- `Delete`: Delete selected node
- `Ctrl+K`: Command palette

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Large workflows (100+ nodes) supported
- Efficient React rendering with memoization
- Local IndexedDB storage
- Minimal re-renders

## Security

- No execution of arbitrary JavaScript
- All workflow data is local
- No external data transmission without explicit user action

## License

MIT
