import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useSettingsStore = create(
  subscribeWithSelector((set, get) => ({
    // General settings
    theme: 'dark',
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds

    // Canvas settings
    showGrid: true,
    snapToGrid: true,
    gridSize: 20,
    showMinimap: true,

    // Execution settings
    executionTimeout: 30000, // 30 seconds
    maxConcurrentNodes: 5,

    // Keyboard shortcuts
    keyboardShortcuts: {
      'Ctrl+S': 'save',
      'Ctrl+Z': 'undo',
      'Ctrl+Shift+Z': 'redo',
      'Ctrl+C': 'copy',
      'Ctrl+V': 'paste',
      'Ctrl+X': 'cut',
      'Delete': 'delete',
      'Ctrl+K': 'commandPalette',
      'Ctrl+A': 'selectAll',
    },

    // Storage settings
    storageEngine: 'indexeddb', // indexeddb, localstorage

    // Actions
    setSetting: (key, value) => {
      set((state) => ({
        [key]: value,
      }));
      get().saveSettings();
    },

    saveSettings: () => {
      const state = get();
      const settings = {
        theme: state.theme,
        autoSave: state.autoSave,
        autoSaveInterval: state.autoSaveInterval,
        showGrid: state.showGrid,
        snapToGrid: state.snapToGrid,
        gridSize: state.gridSize,
        showMinimap: state.showMinimap,
        executionTimeout: state.executionTimeout,
        maxConcurrentNodes: state.maxConcurrentNodes,
        storageEngine: state.storageEngine,
      };
      localStorage.setItem('ares-x-settings', JSON.stringify(settings));
    },

    loadSettings: () => {
      const saved = localStorage.getItem('ares-x-settings');
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          set(settings);
        } catch (e) {
          console.error('Failed to load settings:', e);
        }
      }
    },
  }))
);

export { useSettingsStore };
