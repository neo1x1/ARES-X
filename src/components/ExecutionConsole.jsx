import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiTrash2, FiCopy } from 'react-icons/fi';
import { useWorkflowStore } from '../state/workflowStore';
import './ExecutionConsole.css';

function ExecutionConsole({ height, onHeightChange, onClose }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const initialHeight = useRef(0);

  const executionLogs = useWorkflowStore((state) => state.executionLogs);
  const clearExecutionLogs = useWorkflowStore((state) => state.clearExecutionLogs);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    initialHeight.current = height;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const delta = dragStartY.current - e.clientY;
      const newHeight = Math.max(100, Math.min(500, initialHeight.current + delta));
      onHeightChange(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, height, onHeightChange]);

  const logContent = executionLogs.map((log) => `[${log.timestamp}] ${log.message}`).join('\n');

  return (
    <div className="ares-console-container" style={{ height: `${height}px` }}>
      <div className="console-header">
        <h3>Execution Console</h3>
        <div className="console-actions">
          <button
            className="btn-icon-small"
            title="Copy all"
            onClick={() => navigator.clipboard.writeText(logContent)}
          >
            <FiCopy size={14} />
          </button>
          <button
            className="btn-icon-small"
            title="Clear"
            onClick={clearExecutionLogs}
          >
            <FiTrash2 size={14} />
          </button>
          <button className="btn-icon-small" title="Close" onClick={onClose}>
            <FiX size={14} />
          </button>
        </div>
      </div>

      <div className="console-content">
        {executionLogs.length === 0 ? (
          <div className="console-empty">No logs yet. Run a workflow to see output.</div>
        ) : (
          executionLogs.map((log, idx) => (
            <div key={idx} className={`log-entry log-${log.type?.toLowerCase() || 'info'}`}>
              <span className="log-time">{log.timestamp}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div
        className="ares-console-handle"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

export default ExecutionConsole;
