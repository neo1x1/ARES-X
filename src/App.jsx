import React, { useState, useEffect } from 'react';
import { useWorkflowStore } from './state/workflowStore';
import TopBar from './components/TopBar';
import LeftSidebar from './components/LeftSidebar';
import Canvas from './components/canvas/Canvas';
import RightInspector from './components/RightInspector';
import BottomStatusBar from './components/BottomStatusBar';
import ExecutionConsole from './components/ExecutionConsole';
import NotificationContainer from './components/NotificationContainer';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [inspectorWidth, setInspectorWidth] = useState(320);
  const [consoleHeight, setConsoleHeight] = useState(200);
  const [showConsole, setShowConsole] = useState(false);
  const projectStatus = useWorkflowStore((state) => state.projectStatus);
  const projectName = useWorkflowStore((state) => state.projectName);

  // Load panel widths from localStorage
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

  // Save panel widths to localStorage
  useEffect(() => {
    localStorage.setItem(
      'ares-x-panel-widths',
      JSON.stringify({ sidebar: sidebarWidth, inspector: inspectorWidth, console: consoleHeight })
    );
  }, [sidebarWidth, inspectorWidth, consoleHeight]);

  return (
    <div className="ares-app">
      <TopBar onSettingsClick={() => setShowSettings(true)} onConsoleToggle={() => setShowConsole(!showConsole)} />

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
