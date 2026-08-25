import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { useWorkflowStore } from '../state/workflowStore';
import './RightInspector.css';

function RightInspector({ width, onWidthChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const initialWidth = useRef(0);

  const selectedNodeIds = useWorkflowStore((state) => state.selectedNodeIds);
  const nodes = useWorkflowStore((state) => state.nodes);
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const selectedNode = selectedNodeIds.length > 0
    ? nodes.find((n) => n.id === selectedNodeIds[0])
    : null;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    initialWidth.current = width;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const delta = dragStartX.current - e.clientX;
      const newWidth = Math.max(200, Math.min(500, initialWidth.current + delta));
      onWidthChange(newWidth);
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
  }, [isDragging, width, onWidthChange]);

  return (
    <div className="ares-sidebar-right" style={{ width: `${width}px` }}>
      <div className="inspector-header">
        <h3>Inspector</h3>
      </div>

      <div className="inspector-content">
        {selectedNode ? (
          <div className="inspector-panel">
            <div className="section">
              <div className="section-title">General</div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={selectedNode.data?.title || ''}
                  onChange={(e) =>
                    updateNode(selectedNode.id, {
                      data: { ...selectedNode.data, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input
                  type="text"
                  value={selectedNode.data?.type || ''}
                  disabled
                />
              </div>
            </div>

            <div className="section">
              <div className="section-title">Position</div>
              <div className="form-row">
                <div className="form-group">
                  <label>X</label>
                  <input
                    type="number"
                    value={Math.round(selectedNode.position?.x || 0)}
                    onChange={(e) =>
                      updateNode(selectedNode.id, {
                        position: {
                          ...selectedNode.position,
                          x: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedNode.position?.y || 0)}
                    onChange={(e) =>
                      updateNode(selectedNode.id, {
                        position: {
                          ...selectedNode.position,
                          y: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-selection">
            <p>Select a node to view properties</p>
          </div>
        )}
      </div>

      <div
        className="ares-sidebar-right-handle"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

export default RightInspector;
