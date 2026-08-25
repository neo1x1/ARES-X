import { useRegistryStore } from '../state/registryStore';

// Core node definitions
const coreNodes = [
  // INPUT nodes
  {
    type: 'text-input',
    name: 'Text Input',
    category: 'INPUT',
    icon: '📝',
    description: 'Input a text value',
    version: '1.0.0',
    inputs: [],
    outputs: [{ name: 'value', type: 'string' }],
    defaultData: {
      value: '',
      title: 'Text Input',
    },
  },
  {
    type: 'number-input',
    name: 'Number Input',
    category: 'INPUT',
    icon: '🔢',
    description: 'Input a numeric value',
    version: '1.0.0',
    inputs: [],
    outputs: [{ name: 'value', type: 'number' }],
    defaultData: {
      value: 0,
      title: 'Number Input',
    },
  },
  {
    type: 'boolean-input',
    name: 'Boolean Input',
    category: 'INPUT',
    icon: '✓',
    description: 'Input a boolean value',
    version: '1.0.0',
    inputs: [],
    outputs: [{ name: 'value', type: 'boolean' }],
    defaultData: {
      value: false,
      title: 'Boolean Input',
    },
  },

  // DATA nodes
  {
    type: 'set-value',
    name: 'Set Value',
    category: 'DATA',
    icon: '📋',
    description: 'Set a value in storage',
    version: '1.0.0',
    inputs: [{ name: 'value', type: 'any' }],
    outputs: [{ name: 'done', type: 'boolean' }],
    defaultData: {
      key: 'variable',
      title: 'Set Value',
    },
  },
  {
    type: 'get-value',
    name: 'Get Value',
    category: 'DATA',
    icon: '📂',
    description: 'Get a value from storage',
    version: '1.0.0',
    inputs: [],
    outputs: [{ name: 'value', type: 'any' }],
    defaultData: {
      key: 'variable',
      title: 'Get Value',
    },
  },

  // LOGIC nodes
  {
    type: 'condition',
    name: 'Condition',
    category: 'LOGIC',
    icon: '🔀',
    description: 'Branch based on a condition',
    version: '1.0.0',
    inputs: [{ name: 'condition', type: 'boolean' }],
    outputs: [
      { name: 'true', type: 'boolean' },
      { name: 'false', type: 'boolean' },
    ],
    defaultData: {
      title: 'Condition',
    },
  },
  {
    type: 'compare',
    name: 'Compare',
    category: 'LOGIC',
    icon: '⚖️',
    description: 'Compare two values',
    version: '1.0.0',
    inputs: [
      { name: 'a', type: 'any' },
      { name: 'b', type: 'any' },
    ],
    outputs: [{ name: 'result', type: 'boolean' }],
    defaultData: {
      operator: '===',
      title: 'Compare',
    },
  },

  // UTILITY nodes
  {
    type: 'delay',
    name: 'Delay',
    category: 'UTILITY',
    icon: '⏱️',
    description: 'Wait for a specified duration',
    version: '1.0.0',
    inputs: [],
    outputs: [{ name: 'done', type: 'boolean' }],
    defaultData: {
      duration: 1000,
      title: 'Delay',
    },
  },
  {
    type: 'comment',
    name: 'Comment',
    category: 'UTILITY',
    icon: '💬',
    description: 'Add a comment to the workflow',
    version: '1.0.0',
    inputs: [],
    outputs: [],
    defaultData: {
      text: 'Comment',
      title: 'Comment',
    },
  },

  // OUTPUT nodes
  {
    type: 'output',
    name: 'Output',
    category: 'OUTPUT',
    icon: '📤',
    description: 'Output a value',
    version: '1.0.0',
    inputs: [{ name: 'value', type: 'any' }],
    outputs: [],
    defaultData: {
      title: 'Output',
    },
  },
  {
    type: 'log',
    name: 'Log',
    category: 'OUTPUT',
    icon: '📝',
    description: 'Log a value to console',
    version: '1.0.0',
    inputs: [{ name: 'message', type: 'any' }],
    outputs: [],
    defaultData: {
      title: 'Log',
    },
  },

  // TEXT nodes
  {
    type: 'text-concat',
    name: 'Concatenate',
    category: 'TEXT',
    icon: '✏️',
    description: 'Join text values',
    version: '1.0.0',
    inputs: [
      { name: 'text1', type: 'string' },
      { name: 'text2', type: 'string' },
    ],
    outputs: [{ name: 'result', type: 'string' }],
    defaultData: {
      title: 'Concatenate',
    },
  },

  // JSON nodes
  {
    type: 'json-parse',
    name: 'Parse JSON',
    category: 'JSON',
    icon: '{}',
    description: 'Parse a JSON string',
    version: '1.0.0',
    inputs: [{ name: 'json', type: 'string' }],
    outputs: [{ name: 'object', type: 'object' }],
    defaultData: {
      title: 'Parse JSON',
    },
  },
  {
    type: 'json-stringify',
    name: 'Stringify JSON',
    category: 'JSON',
    icon: '🔤',
    description: 'Convert object to JSON string',
    version: '1.0.0',
    inputs: [{ name: 'object', type: 'object' }],
    outputs: [{ name: 'json', type: 'string' }],
    defaultData: {
      title: 'Stringify JSON',
    },
  },
];

export function initializeNodeRegistry() {
  const registerNode = useRegistryStore((state) => state.registerNode);
  coreNodes.forEach((node) => {
    registerNode(node.type, node);
  });
}

export { coreNodes };
