import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiChevronDown, FiSearch, FiPlus } from 'react-icons/fi';
import { useWorkflowStore } from '../state/workflowStore';
import { useNotificationStore } from '../state/notificationStore';
import { useSettingsStore } from '../state/settingsStore';
import './SettingsPanel.css';

function SettingsPanel({ onClose }) {
  const [activeSection, setActiveSection] = useState('general');
  const theme = useSettingsStore((state) => state.theme);
  const setSetting = useSettingsStore((state) => state.setSetting);
  const showGrid = useSettingsStore((state) => state.showGrid);
  const snapToGrid = useSettingsStore((state) => state.snapToGrid);
  const gridSize = useSettingsStore((state) => state.gridSize);
  const autoSave = useSettingsStore((state) => state.autoSave);
  const autoSaveInterval = useSettingsStore((state) => state.autoSaveInterval);

  const sections = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'canvas', label: 'Canvas' },
    { id: 'execution', label: 'Execution' },
    { id: 'storage', label: 'Storage' },
    { id: 'about', label: 'About' },
  ];

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="btn-close" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="settings-container">
          <div className="settings-sidebar">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="settings-content">
            {activeSection === 'general' && (
              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="setting-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={autoSave}
                      onChange={(e) => setSetting('autoSave', e.target.checked)}
                    />
                    <span>Auto-save projects</span>
                  </label>
                </div>
                <div className="setting-group">
                  <label>Auto-save interval (ms)</label>
                  <input
                    type="number"
                    value={autoSaveInterval}
                    onChange={(e) =>
                      setSetting('autoSaveInterval', parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="settings-section">
                <h3>Appearance</h3>
                <div className="setting-group">
                  <label>Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setSetting('theme', e.target.value)}
                  >
                    <option value="dark">Dark (ARES)</option>
                    <option value="light">Light (Future)</option>
                  </select>
                </div>
              </div>
            )}

            {activeSection === 'canvas' && (
              <div className="settings-section">
                <h3>Canvas Settings</h3>
                <div className="setting-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setSetting('showGrid', e.target.checked)}
                    />
                    <span>Show grid</span>
                  </label>
                </div>
                <div className="setting-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={snapToGrid}
                      onChange={(e) => setSetting('snapToGrid', e.target.checked)}
                    />
                    <span>Snap to grid</span>
                  </label>
                </div>
                <div className="setting-group">
                  <label>Grid size (px)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={gridSize}
                    onChange={(e) => setSetting('gridSize', parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}

            {activeSection === 'execution' && (
              <div className="settings-section">
                <h3>Execution Settings</h3>
                <p className="settings-info">Execution timeout and concurrency settings.</p>
              </div>
            )}

            {activeSection === 'storage' && (
              <div className="settings-section">
                <h3>Storage</h3>
                <p className="settings-info">Projects are stored locally in IndexedDB.</p>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="settings-section">
                <h3>About ARES-X</h3>
                <div className="about-info">
                  <p><strong>ARES-X v1.0.0</strong></p>
                  <p>Enterprise Visual Workflow Workbench</p>
                  <p>A professional desktop application for building and executing visual workflows.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
