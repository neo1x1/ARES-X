import React, { useState, useEffect } from 'react';
import { FiMenu, FiSave, FiPlay, FiSquare, FiSettings, FiSearch, FiCommand } from 'react-icons/fi';
import { useWorkflowStore } from '../state/workflowStore';
import { useNotificationStore } from '../state/notificationStore';
import './TopBar.css';

function TopBar({ onSettingsClick, onConsoleToggle }) {
  const projectName = useWorkflowStore((state) => state.projectName);
  const projectStatus = useWorkflowStore((state) => state.projectStatus);
  const executionState = useWorkflowStore((state) => state.executionState);
  const setProjectStatus = useWorkflowStore((state) => state.setProjectStatus);
  const setExecutionState = useWorkflowStore((state) => state.setExecutionState);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleSave = () => {
    setProjectStatus('SAVING');
    setTimeout(() => {
      setProjectStatus('SAVED');
      addNotification({
        type: 'success',
        title: 'Project Saved',
        message: `"${projectName}" has been saved successfully.`,
      });
    }, 500);
  };

  const handleRun = () => {
    setExecutionState('RUNNING');
    addNotification({
      type: 'info',
      title: 'Workflow Started',
      message: 'Executing workflow...',
    });
    onConsoleToggle();
  };

  const handleStop = () => {
    setExecutionState('STOPPED');
    addNotification({
      type: 'warning',
      title: 'Workflow Stopped',
      message: 'Workflow execution has been stopped.',
    });
  };

  return (
    <div className="ares-topbar">
      <div className="topbar-left">
        <div className="ares-logo">⟡</div>
        <div className="project-info">
          <span className="project-name">{projectName}</span>
          <span className={`project-status ${projectStatus.toLowerCase()}`}>
            {projectStatus}
          </span>
        </div>
      </div>

      <div className="topbar-center">
        <div className="breadcrumb">
          {/* Placeholder for workflow breadcrumb */}
        </div>
      </div>

      <div className="topbar-right">
        <button className="btn-icon" title="Save (Ctrl+S)" onClick={handleSave}>
          <FiSave size={18} />
        </button>

        <button
          className={`btn-icon btn-run ${executionState === 'RUNNING' ? 'active' : ''}`}
          title="Run Workflow"
          onClick={executionState === 'RUNNING' ? handleStop : handleRun}
        >
          {executionState === 'RUNNING' ? <FiSquare size={18} /> : <FiPlay size={18} />}
        </button>

        <button className="btn-icon" title="Search (Ctrl+K)">
          <FiSearch size={18} />
        </button>

        <button className="btn-icon" title="Command Palette (Ctrl+K)">
          <FiCommand size={18} />
        </button>

        <button className="btn-icon" title="Settings" onClick={onSettingsClick}>
          <FiSettings size={18} />
        </button>
      </div>
    </div>
  );
}

export default TopBar;
