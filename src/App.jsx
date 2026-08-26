import React, { useEffect } from 'react';
import { useWorkflowStore } from './state/workflowStore';
import { useSettingsStore } from './state/settingsStore';
import { initializeNodeRegistry } from './registry/nodeRegistry';
import TopBar from './components/TopBar';
import LeftSidebar from './components/LeftSidebar';
import Canvas from './components/canvas/Canvas';
import RightInspector from './components/RightInspector';
import BottomStatusBar from './components/BottomStatusBar';
import ExecutionConsole from './components/ExecutionConsole';
import NotificationContainer from './components/NotificationContainer';
import SettingsPanel from './components/SettingsPanel';
import { useWorkflow } from './hooks/useWorkflow';
import './App.css';

function App() {
  const [showSettings, setShowSettings] = React.useState(false);
  const [sidebarWidth, setSidebarWidth] = React.useState(280);
  const [inspectorWidth, setInspectorWidth] = React.useState(320);
  const [consoleHeight, setConsoleHeight] = React.useState(200);
  const [showConsole, setShowConsole] = React.useState(false);

  const projectStatus = useWorkflowStore((state) => state.projectStatus);
  const projectName = useWorkflowStore((state) => state.projectName);
  const setExecutionState = useWorkflowStore((state) => state.setExecutionState);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const { executeWorkflow } = useWorkflow();

  // Initialize on mount
  useEffect(() => {
    loadSettings();
    initializeNodeRegistry();
  }, [loadSettings]);

  // Load panel widths
  useEffect(() => {
    const saved = localStorage.getItem('ares-x-panel-widths');
    if (saved) {
      try {
        const { sidebar, inspector, console: consoleH } = JSON.parse(saved);
        if (sidebar) setSidebarWidth(sidebar);
        if (inspector) setInspectorWidth(inspector);
        if (consoleH) setConsoleHeight(consoleH);
      } catch (e) {
        console.error('Failed to load panel widths:', e);
      }
    }
  }, []);

  // Save panel widths
  useEffect(() => {
    localStorage.setItem(
      'ares-x-panel-widths',
      JSON.stringify({ sidebar: sidebarWidth, inspector: inspectorWidth, console: consoleHeight })
    );
  }, [sidebarWidth, inspectorWidth, consoleHeight]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Save
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeWorkflow();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [executeWorkflow]);

  const handleConsoleToggle = () => {
    setShowConsole(!showConsole);
  };

  return (
    <div className="ares-app">
      <TopBar onSettingsClick={() => setShowSettings(true)} onConsoleToggle={handleConsoleToggle} />

      <div className="ares-main-container">
        <LeftSidebar width={sidebarWidth} onWidthChange={setSidebarWidth} />
        <Canvas />
        <RightInspector width={inspectorWidth} onWidthChange={setInspectorWidth} />
      </div>

      {showConsole && (
        <ExecutionConsole height={consoleHeight} onHeightChange={setConsoleHeight} onClose={() => setShowConsole(false)} />
      )}

      <BottomStatusBar />
      <NotificationContainer />

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;
