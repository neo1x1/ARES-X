import React, { useCallback } from 'react';
import { ReactFlow, Controls, Background, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '../state/workflowStore';
import { useSettingsStore } from '../state/settingsStore';
import { nanoid } from 'nanoid';
import WorkflowNode from './canvas/WorkflowNode';
import './canvas/Canvas.css';

const nodeTypes = {
  workflow: WorkflowNode,
};

function Canvas() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);
  const addNode = useWorkflowStore((state) => state.addNode);

  const showGrid = useSettingsStore((state) => state.showGrid);
  const gridSize = useSettingsStore((state) => state.gridSize);
  const showMinimap = useSettingsStore((state) => state.showMinimap);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes(
        nodes.map((node) => {
          const change = changes.find((c) => c.id === node.id);
          if (!change) return node;

          if (change.type === 'position' && change.position) {
            return { ...node, position: change.position };
          }
          if (change.type === 'select') {
            return { ...node, selected: change.selected };
          }
          return node;
        })
      );
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges(
        edges.filter((edge) => !changes.some((c) => c.id === edge.id && c.type === 'remove'))
      );
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection) => {
      const newEdge = {
        id: nanoid(),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
      };
      useWorkflowStore.setState((state) => ({
        edges: [...state.edges, newEdge],
      }));
    },
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const data = event.dataTransfer.getData('application/json');
      if (!data) return;

      try {
        const { type, nodeDefinition } = JSON.parse(data);
        if (type === 'node-add') {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          const newNode = {
            id: nanoid(),
            type: 'workflow',
            data: {
              ...nodeDefinition.defaultData,
              type: nodeDefinition.type,
              title: nodeDefinition.name,
              icon: nodeDefinition.icon,
            },
            position: { x, y },
          };
          addNode(newNode);
        }
      } catch (error) {
        console.error('Failed to parse dropped data:', error);
      }
    },
    [addNode]
  );

  return (
    <div className="ares-canvas-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
      >
        {showGrid && <Background gap={gridSize} size={1} />}
        <Controls />
        {showMinimap && (
          <MiniMap style={{ backgroundColor: 'var(--bg-secondary)' }} />
        )}
      </ReactFlow>
    </div>
  );
}

export default Canvas;
