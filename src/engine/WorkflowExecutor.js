import { useWorkflowStore } from '../state/workflowStore';
import { useNotificationStore } from '../state/notificationStore';

class WorkflowExecutor {
  constructor() {
    this.executionState = 'IDLE';
    this.executionGraph = [];
    this.nodeResults = new Map();
    this.logs = [];
  }

  buildExecutionGraph(nodes, edges) {
    const graph = new Map();

    nodes.forEach((node) => {
      graph.set(node.id, {
        id: node.id,
        type: node.data?.type,
        data: node.data,
        dependencies: [],
        dependents: [],
      });
    });

    edges.forEach((edge) => {
      const source = graph.get(edge.source);
      const target = graph.get(edge.target);
      if (source && target) {
        source.dependents.push(target.id);
        target.dependencies.push(source.id);
      }
    });

    return Array.from(graph.values());
  }

  topologicalSort(graph) {
    const visited = new Set();
    const sorted = [];

    const visit = (nodeId) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = graph.find((n) => n.id === nodeId);
      if (node) {
        node.dependencies.forEach((dep) => visit(dep));
        sorted.push(nodeId);
      }
    };

    graph.forEach((node) => visit(node.id));
    return sorted;
  }

  detectCycles(graph) {
    const visited = new Set();
    const recStack = new Set();

    const hasCycle = (nodeId) => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const node = graph.find((n) => n.id === nodeId);
      if (node) {
        for (const dependent of node.dependents) {
          if (!visited.has(dependent)) {
            if (hasCycle(dependent)) return true;
          } else if (recStack.has(dependent)) {
            return true;
          }
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    return graph.some((node) => {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) return true;
      }
      return false;
    });
  }

  async executeNode(nodeId, nodeData, executionGraph) {
    const log = (message, type = 'info') => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        nodeId,
        message,
        type,
      };
      this.logs.push(logEntry);
      return logEntry;
    };

    const startTime = performance.now();

    try {
      let result = null;

      // Execute based on node type
      switch (nodeData.type) {
        case 'text-input':
          result = nodeData.value || '';
          break;

        case 'number-input':
          result = nodeData.value || 0;
          break;

        case 'boolean-input':
          result = nodeData.value || false;
          break;

        case 'delay': {
          const duration = nodeData.duration || 1000;
          await new Promise((resolve) => setTimeout(resolve, duration));
          result = true;
          break;
        }

        case 'text-concat': {
          const text1 = this.nodeResults.get('text1') || '';
          const text2 = this.nodeResults.get('text2') || '';
          result = String(text1) + String(text2);
          break;
        }

        case 'json-parse': {
          const json = this.nodeResults.get('json') || '{}';
          try {
            result = JSON.parse(json);
          } catch (e) {
            throw new Error('Invalid JSON');
          }
          break;
        }

        case 'json-stringify': {
          const obj = this.nodeResults.get('object') || {};
          result = JSON.stringify(obj);
          break;
        }

        case 'compare': {
          const a = this.nodeResults.get('a');
          const b = this.nodeResults.get('b');
          const op = nodeData.operator || '===';
          switch (op) {
            case '===':
              result = a === b;
              break;
            case '!==':
              result = a !== b;
              break;
            case '>':
              result = a > b;
              break;
            case '<':
              result = a < b;
              break;
            case '>=':
              result = a >= b;
              break;
            case '<=':
              result = a <= b;
              break;
            default:
              result = false;
          }
          break;
        }

        case 'log': {
          const message = this.nodeResults.get('message');
          log(`${nodeData.title}: ${JSON.stringify(message)}`);
          result = true;
          break;
        }

        case 'output': {
          const value = this.nodeResults.get('value');
          log(`${nodeData.title}: ${JSON.stringify(value)}`, 'success');
          result = value;
          break;
        }

        default:
          result = null;
      }

      const executionTime = Math.round(performance.now() - startTime);
      this.nodeResults.set(nodeId, result);

      log(`${nodeData.title} executed successfully in ${executionTime}ms`, 'success');
      return { success: true, result, executionTime };
    } catch (error) {
      const executionTime = Math.round(performance.now() - startTime);
      log(`${nodeData.title} failed: ${error.message}`, 'error');
      return { success: false, error: error.message, executionTime };
    }
  }

  async execute(nodes, edges) {
    this.executionState = 'VALIDATING';
    this.nodeResults.clear();
    this.logs = [];

    try {
      const graph = this.buildExecutionGraph(nodes, edges);

      // Check for cycles
      if (this.detectCycles(graph)) {
        throw new Error('Workflow contains a cycle');
      }

      // Get execution order
      const executionOrder = this.topologicalSort(graph);

      this.executionState = 'RUNNING';

      for (const nodeId of executionOrder) {
        const nodeData = nodes.find((n) => n.id === nodeId)?.data;
        if (nodeData) {
          const result = await this.executeNode(nodeId, nodeData, graph);
          if (!result.success) {
            this.executionState = 'FAILED';
            return { success: false, error: result.error, logs: this.logs };
          }
        }
      }

      this.executionState = 'SUCCESS';
      return { success: true, results: this.nodeResults, logs: this.logs };
    } catch (error) {
      this.executionState = 'FAILED';
      return { success: false, error: error.message, logs: this.logs };
    }
  }
}

export { WorkflowExecutor };
