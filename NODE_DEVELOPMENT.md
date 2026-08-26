# Adding Custom Nodes to ARES-X

## Overview

ARES-X provides a flexible node system that allows you to add custom nodes without modifying core components. All nodes are defined in the registry and automatically appear in the node library.

## Node Definition Structure

Each node is defined as a JavaScript object with the following properties:

```javascript
{
  // Unique identifier for the node type
  type: 'my-node',

  // Display name in the library
  name: 'My Node',

  // Category for organization (appears in library)
  category: 'CUSTOM',

  // Icon emoji or symbol
  icon: '⚙️',

  // Detailed description (shown on hover)
  description: 'A custom node that does something special',

  // Semantic version
  version: '1.0.0',

  // Input port definitions
  inputs: [
    { name: 'input1', type: 'string' },
    { name: 'input2', type: 'number' }
  ],

  // Output port definitions
  outputs: [
    { name: 'result', type: 'string' }
  ],

  // Default data when node is created
  defaultData: {
    title: 'My Node',
    customSetting: 'default value'
  }
}
```

## Step-by-Step Guide

### 1. Add Node Definition to Registry

Edit `src/registry/nodeRegistry.js` and add your node to the `coreNodes` array:

```javascript
const coreNodes = [
  // ... existing nodes ...
  {
    type: 'greeting',
    name: 'Greeting',
    category: 'CUSTOM',
    icon: '👋',
    description: 'Generates a greeting message',
    version: '1.0.0',
    inputs: [
      { name: 'name', type: 'string' }
    ],
    outputs: [
      { name: 'message', type: 'string' }
    ],
    defaultData: {
      title: 'Greeting',
      greeting: 'Hello'
    }
  }
];
```

### 2. Add Execution Logic

Edit `src/engine/WorkflowExecutor.js` and add a case for your node type in the `executeNode()` method:

```javascript
switch (nodeData.type) {
  // ... existing cases ...

  case 'greeting': {
    const name = this.nodeResults.get('name') || 'World';
    const greeting = nodeData.greeting || 'Hello';
    result = `${greeting}, ${name}!`;
    break;
  }
}
```

### 3. Test Your Node

1. Run the development server: `npm run dev`
2. Open the application
3. Your node should appear in the library under the CUSTOM category
4. Drag it onto the canvas
5. Connect it to other nodes
6. Run the workflow and check the execution console

## Node Types Reference

### Supported Type System

```
string      - Text values
number      - Numeric values
boolean     - True/false values
object      - JSON objects
array       - Arrays of values
json        - JSON strings
binary      - Binary data
any         - Any type
unknown     - Unknown type
```

## Examples

### Example 1: Simple Calculator Node

```javascript
{
  type: 'add',
  name: 'Add Numbers',
  category: 'MATH',
  icon: '➕',
  description: 'Adds two numbers together',
  version: '1.0.0',
  inputs: [
    { name: 'a', type: 'number' },
    { name: 'b', type: 'number' }
  ],
  outputs: [
    { name: 'sum', type: 'number' }
  ],
  defaultData: {
    title: 'Add'
  }
}
```

Execution logic:

```javascript
case 'add': {
  const a = this.nodeResults.get('a') || 0;
  const b = this.nodeResults.get('b') || 0;
  result = a + b;
  break;
}
```

### Example 2: Data Transformation Node

```javascript
{
  type: 'uppercase',
  name: 'To Uppercase',
  category: 'TEXT',
  icon: '⬆️',
  description: 'Converts text to uppercase',
  version: '1.0.0',
  inputs: [
    { name: 'text', type: 'string' }
  ],
  outputs: [
    { name: 'result', type: 'string' }
  ],
  defaultData: {
    title: 'To Uppercase'
  }
}
```

Execution logic:

```javascript
case 'uppercase': {
  const text = this.nodeResults.get('text') || '';
  result = String(text).toUpperCase();
  break;
}
```

### Example 3: Async Node

```javascript
{
  type: 'wait-and-respond',
  name: 'Wait and Respond',
  category: 'UTILITY',
  icon: '⏰',
  description: 'Waits then returns a response',
  version: '1.0.0',
  inputs: [
    { name: 'duration', type: 'number' }
  ],
  outputs: [
    { name: 'message', type: 'string' }
  ],
  defaultData: {
    title: 'Wait and Respond',
    responseMessage: 'Done!'
  }
}
```

Execution logic:

```javascript
case 'wait-and-respond': {
  const duration = this.nodeResults.get('duration') || 1000;
  const message = nodeData.responseMessage || 'Done!';
  await new Promise(resolve => setTimeout(resolve, duration));
  result = message;
  break;
}
```

## Inspector Configuration

When a user selects your node in the canvas, the right inspector panel shows configurable properties. Currently, this displays:

- Title (text input)
- Type (read-only)
- Position (X/Y coordinates)

### Adding Custom Inspector Fields

To add custom configuration fields for your node, edit `src/components/RightInspector.jsx` and add form fields in the inspector panel based on `nodeData` properties.

Example:

```jsx
<div className="form-group">
  <label>Custom Setting</label>
  <input
    type="text"
    value={selectedNode.data?.customSetting || ''}
    onChange={(e) =>
      updateNode(selectedNode.id, {
        data: { ...selectedNode.data, customSetting: e.target.value },
      })
    }
  />
</div>
```

## Validation

Your node is automatically validated by the `WorkflowValidator`. It checks:

- Node has a title
- Node has a type
- All connections reference valid nodes
- No circular dependencies (cycles)

To add custom validation for your node type, edit `src/engine/WorkflowValidator.js`.

## Best Practices

1. **Meaningful Names**: Use clear, descriptive names for your nodes
2. **Category Organization**: Place nodes in appropriate categories
3. **Input/Output Types**: Specify types accurately for validation
4. **Error Handling**: Wrap execution logic in try-catch
5. **Logging**: Use `log()` function in executor to provide feedback
6. **Default Data**: Set sensible defaults for all node properties
7. **Documentation**: Keep descriptions concise but informative

## Troubleshooting

### Node doesn't appear in library

- Check that your node is added to `coreNodes` array
- Verify the category exists (or add it to categories list)
- Make sure the application is rebuilt/restarted

### Node execution fails

- Check the Execution Console for error messages
- Verify the case statement is added to `WorkflowExecutor`
- Check that input names match in `nodeResults.get()`

### Connections not working

- Verify input/output definitions in node registry
- Check that node is properly connected on canvas
- Look for connection validation errors in status bar

## Advanced Topics

### Async Operations

Nodes can perform async operations:

```javascript
case 'fetch-data': {
  const url = this.nodeResults.get('url') || '';
  try {
    const response = await fetch(url);
    result = await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }
  break;
}
```

### Complex State

For nodes that need internal state, store results in `this.nodeResults`:

```javascript
case 'accumulate': {
  const current = this.nodeResults.get('total') || 0;
  const add = this.nodeResults.get('add') || 0;
  result = current + add;
  this.nodeResults.set('total', result);
  break;
}
```

## Next Steps

- Explore existing nodes in `src/registry/nodeRegistry.js`
- Review executor implementation in `src/engine/WorkflowExecutor.js`
- Test your nodes with various workflow configurations
- Consider performance implications for large datasets
