import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useRegistryStore = create(
  subscribeWithSelector((set, get) => ({
    nodeRegistry: {},
    categories: [
      'INPUT',
      'DATA',
      'TRANSFORM',
      'LOGIC',
      'UTILITY',
      'OUTPUT',
      'TEXT',
      'JSON',
      'FILE',
      'HTTP',
      'CODE',
      'AI',
      'DATABASE',
      'SYSTEM',
      'DEVELOPER',
      'VISUALIZATION',
    ],

    registerNode: (nodeType, definition) => {
      set((state) => ({
        nodeRegistry: {
          ...state.nodeRegistry,
          [nodeType]: definition,
        },
      }));
    },

    getNodeDefinition: (nodeType) => {
      return get().nodeRegistry[nodeType] || null;
    },

    getNodesByCategory: (category) => {
      const registry = get().nodeRegistry;
      return Object.values(registry).filter((def) => def.category === category);
    },

    getAllNodes: () => {
      return Object.values(get().nodeRegistry);
    },

    searchNodes: (query) => {
      const lowerQuery = query.toLowerCase();
      const registry = get().nodeRegistry;
      return Object.values(registry).filter(
        (def) =>
          def.name.toLowerCase().includes(lowerQuery) ||
          def.description.toLowerCase().includes(lowerQuery) ||
          def.category.toLowerCase().includes(lowerQuery)
      );
    },
  }))
);

export { useRegistryStore };
