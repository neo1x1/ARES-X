import { useWorkflowStore } from '../state/workflowStore';
import { useNotificationStore } from '../state/notificationStore';

class WorkflowValidator {
  validate(nodes, edges) {
    const errors = [];
    const warnings = [];

    // Check for nodes
    if (nodes.length === 0) {
      warnings.push({
        id: 'no-nodes',
        message: 'Workflow contains no nodes',
        severity: 'warning',
      });
    }

    // Check each node
    nodes.forEach((node) => {
      if (!node.data?.title) {
        errors.push({
          id: `node-${node.id}-no-title`,
          nodeId: node.id,
          message: `Node ${node.id} has no title`,
          severity: 'error',
        });
      }

      if (!node.data?.type) {
        errors.push({
          id: `node-${node.id}-no-type`,
          nodeId: node.id,
          message: `Node ${node.id} has no type`,
          severity: 'error',
        });
      }
    });

    // Check connections
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (!sourceNode) {
        errors.push({
          id: `edge-${edge.id}-no-source`,
          edgeId: edge.id,
          message: `Connection references non-existent source node`,
          severity: 'error',
        });
      }

      if (!targetNode) {
        errors.push({
          id: `edge-${edge.id}-no-target`,
          edgeId: edge.id,
          message: `Connection references non-existent target node`,
          severity: 'error',
        });
      }
    });

    // Check for orphaned nodes
    const connectedNodes = new Set();
    edges.forEach((edge) => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });

    nodes.forEach((node) => {
      if (!connectedNodes.has(node.id) && nodes.length > 1) {
        warnings.push({
          id: `node-${node.id}-orphaned`,
          nodeId: node.id,
          message: `Node "${node.data?.title}" is not connected to the workflow`,
          severity: 'warning',
        });
      }
    });

    return { errors, warnings, isValid: errors.length === 0 };
  }
}

export { WorkflowValidator };
