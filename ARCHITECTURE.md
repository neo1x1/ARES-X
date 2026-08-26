# ARES-X Architecture

## Overview

ARES-X is built using a modular, scalable architecture designed to support complex workflow operations while maintaining clean separation of concerns.

## Core Architecture

```
Application Layer (UI Components)
    ↓
State Management (Zustand Stores)
    ↓
Business Logic (Hooks, Engine)
    ↓
Data Layer (Local Storage, IndexedDB)
```

## Directory Structure

### `/src/components`

UI components organized by feature:

- **TopBar**: Main toolbar with project controls
- **LeftSidebar**: Node library and search
- **Canvas**: Visual workflow editor (React Flow)
- **RightInspector**: Node property editor
- **BottomStatusBar**: Status indicators
- **ExecutionConsole**: Execution logs and output
- **SettingsPanel**: Application settings
- **NotificationContainer**: Toast notifications

### `/src/state`

Zustand stores for state management:

#### `workflowStore.js`

- Nodes and edges state
- Selection state
- Execution state
- Validation state
- History (undo/redo)
- Actions: addNode, updateNode, deleteNode, etc.

#### `notificationStore.js`

- Notifications array
- Actions: addNotification, removeNotification
- Auto-dismiss logic

#### `settingsStore.js`

- User preferences
- Canvas settings (grid, minimap)
- Execution settings
- Keyboard shortcuts
- Persistence to localStorage

#### `registryStore.js`

- Node definitions registry
- Category management
- Node search functionality
- Registry queries

### `/src/engine`

Workflow execution engine:

#### `WorkflowExecutor.js`

- Builds execution graph from nodes/edges
- Topological sorting for execution order
- Cycle detection
- Node execution logic
- Result propagation
- Error handling

#### `WorkflowValidator.js`

- Validates workflow structure
- Checks for missing connections
- Detects orphaned nodes
- Validates node configuration
- Returns errors and warnings

### `/src/registry`

#### `nodeRegistry.js`

- Core node definitions
- Node type enumeration
- Default configuration for each node type
- Input/output specifications

### `/src/hooks`

#### `useWorkflow.js`

- High-level workflow operations
- Validation workflow
- Execute workflow
- Combines multiple stores and engine functions

### `/src/styles`

#### `global.css`

- Design tokens (colors, spacing, radius)
- CSS custom properties
- Base element styling

## State Flow

### Adding a Node

```
User Action (Drag/Click)
    ↓
Canvas receives drop event
    ↓
Node definition extracted from registry
    ↓
New node object created with unique ID
    ↓
workflowStore.addNode()
    ↓
State updated, history saved
    ↓
React re-renders canvas
```

### Executing a Workflow

```
User clicks Run
    ↓
useWorkflow.executeWorkflow()
    ↓
Validator.validate(nodes, edges)
    ↓
Build execution graph
    ↓
Detect cycles
    ↓
Topological sort
    ↓
Execute each node in order
    ↓
Propagate results
    ↓
Log execution events
    ↓
Update state with results
    ↓
Notify user
```

## Data Models

### Node

```javascript
{
  id: string (unique),
  type: string (node type),
  position: { x: number, y: number },
  data: {
    title: string,
    type: string,
    icon: string,
    status: string,
    inputs?: [],
    outputs?: [],
    // ... node-specific data
  },
  selected?: boolean
}
```

### Edge

```javascript
{
  id: string (unique),
  source: string (node ID),
  target: string (node ID),
  sourceHandle: string,
  targetHandle: string
}
```

### Workflow

```javascript
{
  schemaVersion: number,
  project: {
    name: string,
    description: string,
    createdAt: ISO string,
    updatedAt: ISO string
  },
  nodes: Node[],
  edges: Edge[],
  viewport: { x, y, zoom }
}
```

## Adding Custom Nodes

### Step 1: Define Node in Registry

```javascript
// src/registry/nodeRegistry.js
{
  type: 'my-custom-node',
  name: 'My Custom Node',
  category: 'CUSTOM',
  icon: '🔧',
  description: 'Does something useful',
  version: '1.0.0',
  inputs: [
    { name: 'input1', type: 'string' },
    { name: 'input2', type: 'number' }
  ],
  outputs: [
    { name: 'result', type: 'string' }
  ],
  defaultData: {
    title: 'My Custom Node',
    setting1: 'value'
  }
}
```

### Step 2: Register in Executor

Add case to `WorkflowExecutor.executeNode()`:

```javascript
case 'my-custom-node': {
  const input1 = this.nodeResults.get('input1');
  const input2 = this.nodeResults.get('input2');
  result = await myCustomLogic(input1, input2);
  break;
}
```

### Step 3: Node Appears Automatically

The node will automatically appear in the library under its category.

## Performance Considerations

### Canvas Optimization

- Memoized node components prevent unnecessary re-renders
- React Flow handles efficient viewport rendering
- Only visible nodes are rendered in the DOM

### State Management

- Zustand provides fine-grained subscriptions
- Only components using changed data re-render
- Immutable updates ensure React diffing works efficiently

### Execution

- Topological sort ensures optimal execution order
- Cycle detection prevents infinite loops
- Early error handling stops execution immediately

## Security Model

### Code Execution

- No arbitrary JavaScript execution
- All node logic predefined and safe
- Code nodes (if implemented) would use Web Workers and timeouts

### Data Storage

- All data stored locally in browser (IndexedDB)
- No external requests without explicit user action
- No secrets stored in workflows

### Import/Export

- All imported workflows validated before execution
- Schema versioning for future compatibility
- Malformed workflows rejected gracefully

## Testing Strategy

### Unit Tests

- Node registry functions
- Workflow validator logic
- Execution graph building
- Topological sort algorithm

### Integration Tests

- Workflow execution end-to-end
- State management interactions
- Canvas node operations

### Manual Tests

- UI responsiveness
- Large workflow performance
- Error state handling
- Keyboard shortcuts

## Future Extensions

### Planned Features

- HTTP request node with actual requests
- Database nodes (read/write)
- WebSocket nodes for real-time data
- Custom node templates
- Workflow templates
- Collaboration features
- Cloud sync

### Plugin Architecture

The node registry system is designed to support:

- Custom node types via registry API
- External node packages
- Plugin hot-loading
- Namespace isolation

## Deployment

### Production Build

```bash
npm run build
```

Generates optimized bundle in `/dist`

### Hosting

- Static hosting (Netlify, Vercel, etc.)
- No backend required
- Works offline (with local storage)

## Dependencies

### Core

- `react@18.2.0` - UI framework
- `react-dom@18.2.0` - React DOM rendering
- `@xyflow/react@12.1.0` - Workflow canvas
- `zustand@4.5.0` - State management

### Utilities

- `nanoid@5.0.0` - ID generation
- `react-icons@5.0.1` - Icon library
- `lucide-react@0.408.0` - Additional icons

### Build

- `vite@5.0.0` - Build tool
- `@vitejs/plugin-react@4.2.0` - React plugin

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires ES2020 support

## Known Limitations

1. No real HTTP requests (security model)
2. No file system access (browser sandbox)
3. No database integration (planned)
4. Single user (no collaboration yet)
5. No cloud sync (planned)

## Performance Targets

- Canvas interaction: <16ms (60fps)
- Node execution: <1s for typical workflows
- Workflow with 100+ nodes: Fully responsive
- Application startup: <2s

## Debugging

### Console Logging

```javascript
import { useWorkflowStore } from './state/workflowStore';

const store = useWorkflowStore.getState();
console.log(store);
```

### Execution Console

Built-in execution console shows all logs, errors, and warnings with timestamps.

### React DevTools

Full support for React DevTools browser extension for component inspection.
