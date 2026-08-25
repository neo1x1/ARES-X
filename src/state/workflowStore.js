import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useWorkflowStore = create(
  subscribeWithSelector((set, get) => ({
    // Project state
    projectName: 'Untitled Workflow',
    projectStatus: 'SAVED', // SAVED, UNSAVED, SAVING
    projectDescription: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // Canvas state
    nodes: [],
    edges: [],
    selectedNodeIds: [],
    selectedEdgeIds: [],
    viewport: { x: 0, y: 0, zoom: 1 },

    // Execution state
    executionState: 'IDLE', // IDLE, VALIDATING, QUEUED, RUNNING, SUCCESS, FAILED, STOPPED
    executionLogs: [],
    executionErrors: [],

    // History
    history: [],
    historyIndex: -1,

    // Validation
    validationErrors: [],
    validationWarnings: [],

    // Actions
    setProjectName: (name) => set({ projectName: name }),
    setProjectDescription: (desc) => set({ projectDescription: desc }),
    setProjectStatus: (status) => set({ projectStatus: status }),

    addNode: (node) => {
      set((state) => ({
        nodes: [...state.nodes, node],
        projectStatus: 'UNSAVED',
      }));
      get().saveToHistory('add_node');
    },

    updateNode: (nodeId, updates) => {
      set((state) => ({
        nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
        projectStatus: 'UNSAVED',
      }));
      get().saveToHistory('update_node');
    },

    deleteNode: (nodeId) => {
      set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== nodeId),
        edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
        projectStatus: 'UNSAVED',
      }));
      get().saveToHistory('delete_node');
    },

    addEdge: (edge) => {
      set((state) => ({
        edges: [...state.edges, edge],
        projectStatus: 'UNSAVED',
      }));
      get().saveToHistory('add_edge');
    },

    deleteEdge: (edgeId) => {
      set((state) => ({
        edges: state.edges.filter((e) => e.id !== edgeId),
        projectStatus: 'UNSAVED',
      }));
      get().saveToHistory('delete_edge');
    },

    setNodes: (nodes) => {
      set((state) => ({
        nodes,
        projectStatus: 'UNSAVED',
      }));
    },

    setEdges: (edges) => {
      set((state) => ({
        edges,
        projectStatus: 'UNSAVED',
      }));
    },

    setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),
    setSelectedEdgeIds: (ids) => set({ selectedEdgeIds: ids }),

    setViewport: (viewport) => set({ viewport }),

    addExecutionLog: (log) => {
      set((state) => ({
        executionLogs: [...state.executionLogs, { ...log, timestamp: new Date().toISOString() }],
      }));
    },

    clearExecutionLogs: () => set({ executionLogs: [], executionErrors: [] }),

    setExecutionState: (state) => set({ executionState: state }),

    setValidationErrors: (errors) => set({ validationErrors: errors }),
    setValidationWarnings: (warnings) => set({ validationWarnings: warnings }),

    // History management
    saveToHistory: (action) => {
      set((state) => {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          action,
          timestamp: new Date().toISOString(),
          state: {
            nodes: state.nodes,
            edges: state.edges,
            selectedNodeIds: state.selectedNodeIds,
          },
        });
        // Limit history to 100 entries
        if (newHistory.length > 100) newHistory.shift();
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
    },

    undo: () => {
      const state = get();
      if (state.historyIndex > 0) {
        const previousState = state.history[state.historyIndex - 1];
        set({
          nodes: previousState.state.nodes,
          edges: previousState.state.edges,
          selectedNodeIds: previousState.state.selectedNodeIds,
          historyIndex: state.historyIndex - 1,
          projectStatus: 'UNSAVED',
        });
      }
    },

    redo: () => {
      const state = get();
      if (state.historyIndex < state.history.length - 1) {
        const nextState = state.history[state.historyIndex + 1];
        set({
          nodes: nextState.state.nodes,
          edges: nextState.state.edges,
          selectedNodeIds: nextState.state.selectedNodeIds,
          historyIndex: state.historyIndex + 1,
          projectStatus: 'UNSAVED',
        });
      }
    },

    reset: () => {
      set({
        projectName: 'Untitled Workflow',
        projectStatus: 'SAVED',
        projectDescription: '',
        nodes: [],
        edges: [],
        selectedNodeIds: [],
        selectedEdgeIds: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        executionState: 'IDLE',
        executionLogs: [],
        executionErrors: [],
        history: [],
        historyIndex: -1,
        validationErrors: [],
        validationWarnings: [],
      });
    },
  }))
);

export { useWorkflowStore };
