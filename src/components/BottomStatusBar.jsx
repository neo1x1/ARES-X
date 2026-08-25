import React from 'react';
import { useWorkflowStore } from '../state/workflowStore';
import './BottomStatusBar.css';

function BottomStatusBar() {
  const projectStatus = useWorkflowStore((state) => state.projectStatus);
  const executionState = useWorkflowStore((state) => state.executionState);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const validationErrors = useWorkflowStore((state) => state.validationErrors);
  const validationWarnings = useWorkflowStore((state) => state.validationWarnings);

  return (
    <div className="ares-statusbar">
      <div className="status-section">
        <span className="status-label">Status:</span>
        <span className={`status-value ${executionState.toLowerCase()}`}>
          {executionState}
        </span>
      </div>

      <div className="status-section">
        <span className="status-label">Nodes:</span>
        <span className="status-value">{nodes.length}</span>
      </div>

      <div className="status-section">
        <span className="status-label">Connections:</span>
        <span className="status-value">{edges.length}</span>
      </div>

      {validationErrors.length > 0 && (
        <div className="status-section">
          <span className="status-label">Errors:</span>
          <span className="status-value error">{validationErrors.length}</span>
        </div>
      )}

      {validationWarnings.length > 0 && (
        <div className="status-section">
          <span className="status-label">Warnings:</span>
          <span className="status-value warning">{validationWarnings.length}</span>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <div className="status-section">
        <span className="status-label">Project:</span>
        <span className={`status-value ${projectStatus.toLowerCase()}`}>
          {projectStatus}
        </span>
      </div>
    </div>
  );
}

export default BottomStatusBar;
