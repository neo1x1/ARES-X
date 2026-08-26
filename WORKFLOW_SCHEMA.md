# ARES-X Workflow Schema

## Schema Version 1

Workflows are exported as JSON files with the following structure:

### Root Object

```json
{
  "schemaVersion": 1,
  "project": { ... },
  "nodes": [ ... ],
  "edges": [ ... ],
  "viewport": { ... }
}
```

## Project Metadata

```json
{
  "name": "My Workflow",
  "description": "A workflow that does something useful",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z",
  "version": "1.0.0",
  "author": "User Name"
}
```

## Nodes

Array of node objects:

```json
{
  "id": "node-abc123",
  "type": "workflow",
  "position": {
    "x": 100,
    "y": 200
  },
  "data": {
    "title": "Text Input",
    "type": "text-input",
    "icon": "📝",
    "value": "Hello, World!",
    "status": "IDLE",
    "inputs": [],
    "outputs": [
      {
        "name": "value",
        "type": "string"
      }
    ]
  },
  "selected": false
}
```

### Node Data Properties

- `title` (string): Display name of the node
- `type` (string): Node type identifier
- `icon` (string): Icon emoji or symbol
- `status` (string): Current state (IDLE, RUNNING, SUCCESS, ERROR, etc.)
- `inputs` (array): Input port definitions
- `outputs` (array): Output port definitions
- Additional properties: Node-specific configuration

## Edges

Array of connection objects:

```json
{
  "id": "edge-xyz789",
  "source": "node-abc123",
  "target": "node-def456",
  "sourceHandle": "output-0",
  "targetHandle": "input-0"
}
```

### Edge Properties

- `source` (string): Source node ID
- `target` (string): Target node ID
- `sourceHandle` (string): Output port identifier
- `targetHandle` (string): Input port identifier

## Viewport

Canvas state for restoring user view:

```json
{
  "x": 0,
  "y": 0,
  "zoom": 1
}
```

## Complete Example

```json
{
  "schemaVersion": 1,
  "project": {
    "name": "Simple Workflow",
    "description": "A simple workflow example",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z",
    "version": "1.0.0"
  },
  "nodes": [
    {
      "id": "input-1",
      "type": "workflow",
      "position": { "x": 50, "y": 100 },
      "data": {
        "title": "Name Input",
        "type": "text-input",
        "icon": "📝",
        "value": "Alice",
        "outputs": [{"name": "value", "type": "string"}]
      }
    },
    {
      "id": "greeting-1",
      "type": "workflow",
      "position": { "x": 250, "y": 100 },
      "data": {
        "title": "Greeting",
        "type": "text-concat",
        "icon": "👋",
        "inputs": [
          {"name": "text1", "type": "string"},
          {"name": "text2", "type": "string"}
        ],
        "outputs": [{"name": "result", "type": "string"}]
      }
    },
    {
      "id": "output-1",
      "type": "workflow",
      "position": { "x": 450, "y": 100 },
      "data": {
        "title": "Output",
        "type": "output",
        "icon": "📤",
        "inputs": [{"name": "value", "type": "any"}]
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "input-1",
      "target": "greeting-1",
      "sourceHandle": "output-0",
      "targetHandle": "input-0"
    },
    {
      "id": "edge-2",
      "source": "greeting-1",
      "target": "output-1",
      "sourceHandle": "output-0",
      "targetHandle": "input-0"
    }
  ],
  "viewport": {
    "x": 0,
    "y": 0,
    "zoom": 1
  }
}
```

## Schema Validation

When importing a workflow, ARES-X validates:

1. **Schema Version**: Must be 1 or compatible
2. **Project**: Must have required metadata fields
3. **Nodes**: All nodes must have id, type, position, data
4. **Edges**: Source and target nodes must exist
5. **Data Types**: Node types must be registered
6. **Connections**: Connection types must be compatible

## Import/Export

### Exporting a Workflow

1. File > Export
2. Select location and filename
3. File saved as `workflow.json`

### Importing a Workflow

1. File > Import
2. Select a `.json` file
3. Workflow validated and loaded
4. Errors displayed if import fails

## Migration and Versioning

When schema version changes:

1. New version gets new `schemaVersion` number
2. Migration functions handle old formats
3. Automatic upgrade of older workflows
4. Backward compatibility maintained where possible

### Future Schema Enhancements

- Schema v2: Groups and subworkflows
- Schema v3: Workflow templates and variables
- Schema v4: Collaboration metadata

## Error Handling

Invalid workflows are handled gracefully:

```json
{
  "success": false,
  "errors": [
    "Node 'node-123' references non-existent node 'node-456'",
    "Unknown node type: 'custom-node'"
  ]
}
```

## Performance Considerations

- Large workflows (100+ nodes) result in files under 50KB
- Minified exports remove whitespace for distribution
- Schema uses flat structure for efficient parsing
