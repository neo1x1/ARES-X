import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import './WorkflowNode.css';

const WorkflowNode = memo(({ data, selected }) => {
  const statusColors = {
    IDLE: 'var(--text-muted)',
    READY: 'var(--accent-primary)',
    QUEUED: 'var(--accent-warning)',
    RUNNING: 'var(--accent-primary)',
    SUCCESS: 'var(--accent-success)',
    WARNING: 'var(--accent-warning)',
    ERROR: 'var(--accent-error)',
    STOPPED: 'var(--text-muted)',
    DISABLED: 'var(--text-muted)',
  };

  const status = data.status || 'IDLE';
  const statusColor = statusColors[status] || statusColors.IDLE;

  return (
    <div
      className={`workflow-node ${selected ? 'selected' : ''} ${status.toLowerCase()}`}
    >
      <div className="node-header">
        <div className="node-icon-container">
          <span className="node-icon">{data.icon || '◼'}</span>
          <div className="status-indicator" style={{ borderColor: statusColor }} />
        </div>
        <div className="node-title">{data.title || 'Untitled Node'}</div>
      </div>

      <div className="node-handles">
        {data.inputs && data.inputs.length > 0 && (
          <div className="handles-group inputs">
            {data.inputs.map((input, idx) => (
              <Handle
                key={`input-${idx}`}
                type="target"
                position={Position.Left}
                id={`input-${idx}`}
                style={{ top: `${30 + idx * 25}px` }}
                title={input.name}
              />
            ))}
          </div>
        )}
        {data.outputs && data.outputs.length > 0 && (
          <div className="handles-group outputs">
            {data.outputs.map((output, idx) => (
              <Handle
                key={`output-${idx}`}
                type="source"
                position={Position.Right}
                id={`output-${idx}`}
                style={{ top: `${30 + idx * 25}px` }}
                title={output.name}
              />
            ))}
          </div>
        )}
      </div>

      <div className="node-footer">
        <div className="status-text">{status}</div>
        {data.executionTime && (
          <div className="execution-time">{data.executionTime}ms</div>
        )}
      </div>
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';

export default WorkflowNode;
